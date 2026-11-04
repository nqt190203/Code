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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const p = getPool();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { milestoneId, imageBase64 } = body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const now = Date.now();
    const dbRes = await p.query("SELECT data FROM love_anniversary WHERE id = 'main'");
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Data not initialized' });
    }

    const currentData = dbRes.rows[0].data;
    if (Array.isArray(currentData.milestones)) {
      const ms = currentData.milestones.find(m => m.id === Number(milestoneId));
      if (ms) {
        ms.image = imageBase64;
        currentData.lastUpdated = now;

        await p.query(
          `UPDATE love_anniversary SET data = $1, last_updated = $2 WHERE id = 'main'`,
          [currentData, now]
        );
      }
    }

    return res.status(200).json({
      success: true,
      url: imageBase64,
      lastUpdated: now
    });
  } catch (err) {
    console.error('Neon upload error:', err);
    return res.status(500).json({ error: err.message });
  }
};
