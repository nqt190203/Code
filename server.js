const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3344;
const BASE_DIR = __dirname;
const ASSETS_DIR = path.join(BASE_DIR, 'assets');
const DATA_FILE = path.join(BASE_DIR, 'data.json');

const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_1VkxmnlqZd4N@ep-dawn-sea-bd5lfv8y-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Initialize PostgreSQL connection pool to Neon
const pool = new Pool({
  connectionString: NEON_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

// Auto-verify/create database table on launch
async function ensureNeonTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS love_anniversary (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        last_updated BIGINT NOT NULL
      );
    `);
    // Ensure initial row exists
    const check = await pool.query("SELECT id FROM love_anniversary WHERE id = 'main'");
    if (check.rows.length === 0 && fs.existsSync(DATA_FILE)) {
      const initData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      await pool.query(
        "INSERT INTO love_anniversary (id, data, last_updated) VALUES ('main', $1, $2)",
        [initData, Date.now()]
      );
      console.log('Neon Database: Seeded main anniversary row.');
    }
    console.log('Neon Database: Connected & Ready 24/7.');
  } catch (err) {
    console.warn('Neon connection notice (using local file fallback if offline):', err.message);
  }
}
ensureNeonTable();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const reqPath = decodeURI(urlObj.pathname);

  // API 1: GET /api/data (Sync couple data & milestones from Neon)
  if (reqPath === '/api/data' && req.method === 'GET') {
    try {
      const dbRes = await pool.query("SELECT data, last_updated FROM love_anniversary WHERE id = 'main'");
      if (dbRes.rows.length > 0) {
        const payload = dbRes.rows[0].data;
        payload.lastUpdated = Number(dbRes.rows[0].last_updated);
        sendJSON(res, 200, payload);
        return;
      }
    } catch (err) {
      console.warn('Neon read fallback to file:', err.message);
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        sendJSON(res, 200, JSON.parse(raw));
        return;
      } catch (err) {
        console.error('Error reading data.json:', err);
      }
    }
    sendJSON(res, 200, { initialized: false });
    return;
  }

  // API 2: POST /api/data (Save updated couple configuration to Neon)
  if (reqPath === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        const now = Date.now();
        parsed.lastUpdated = now;

        try {
          await pool.query(
            `INSERT INTO love_anniversary (id, data, last_updated)
             VALUES ('main', $1, $2)
             ON CONFLICT (id) DO UPDATE SET data = $1, last_updated = $2`,
            [parsed, now]
          );
        } catch (dbErr) {
          console.warn('Neon save error:', dbErr.message);
        }

        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        } catch (fsErr) {}

        sendJSON(res, 200, { success: true, lastUpdated: now });
      } catch (err) {
        sendJSON(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // API 3: POST /api/upload (Upload photo for a milestone and sync to Neon)
  if (reqPath === '/api/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { milestoneId, imageBase64 } = JSON.parse(body);
        if (!imageBase64) {
          sendJSON(res, 400, { error: 'Missing imageBase64' });
          return;
        }

        const now = Date.now();
        let currentData = null;

        // Try getting latest data from Neon
        try {
          const dbRes = await pool.query("SELECT data FROM love_anniversary WHERE id = 'main'");
          if (dbRes.rows.length > 0) {
            currentData = dbRes.rows[0].data;
          }
        } catch (e) {
          console.warn('Neon fetch error during upload:', e.message);
        }

        if (!currentData && fs.existsSync(DATA_FILE)) {
          currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }

        if (currentData && Array.isArray(currentData.milestones)) {
          const ms = currentData.milestones.find(m => m.id === Number(milestoneId));
          if (ms) {
            ms.image = imageBase64; // Store optimized photo base64 directly in Neon cloud!
            currentData.lastUpdated = now;

            try {
              await pool.query(
                `INSERT INTO love_anniversary (id, data, last_updated)
                 VALUES ('main', $1, $2)
                 ON CONFLICT (id) DO UPDATE SET data = $1, last_updated = $2`,
                [currentData, now]
              );
            } catch (saveDbErr) {
              console.warn('Neon upload save error:', saveDbErr.message);
            }

            try {
              fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf8');
            } catch (saveFsErr) {}
          }
        }

        sendJSON(res, 200, {
          success: true,
          url: imageBase64,
          lastUpdated: now
        });
      } catch (err) {
        console.error('Upload error:', err);
        sendJSON(res, 500, { error: 'Failed to process image upload: ' + err.message });
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(BASE_DIR, reqPath === '/' ? 'index.html' : reqPath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Anniversary Web server running at http://127.0.0.1:${PORT}`);
});
