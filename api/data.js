const { Pool } = require('pg');

const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_1VkxmnlqZd4N@ep-dawn-sea-bd5lfv8y-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: NEON_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const p = getPool();

  if (req.method === 'GET') {
    try {
      const dbRes = await p.query("SELECT data, last_updated FROM love_anniversary WHERE id = 'main'");
      if (dbRes.rows.length > 0) {
        const payload = dbRes.rows[0].data;
        payload.lastUpdated = Number(dbRes.rows[0].last_updated);
        return res.status(200).json(payload);
      }
      return res.status(200).json({ initialized: false });
    } catch (err) {
      console.error('Neon GET error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = Date.now();
      payload.lastUpdated = now;

      await p.query(
        `INSERT INTO love_anniversary (id, data, last_updated)
         VALUES ('main', $1, $2)
         ON CONFLICT (id) DO UPDATE SET data = $1, last_updated = $2`,
        [payload, now]
      );

      return res.status(200).json({ success: true, lastUpdated: now });
    } catch (err) {
      console.error('Neon POST error:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
