// telegram-backend/api/send.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ ok: false, error: 'No text provided' });
  }

  try {
    const TG_TOKEN = process.env.TG_TOKEN;
    const TG_CHAT_IDS = process.env.TG_CHAT_IDS.split(',');

    await Promise.all(
      TG_CHAT_IDS.map(chat_id =>
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
        })
      )
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}