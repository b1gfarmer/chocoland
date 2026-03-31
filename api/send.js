// telegram-backend/api/send.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://chocoland-five.vercel.app',
    'https://шоколэнд.рус',
    'https://xn--d1aldicb1e1b.xn--p1acf' // punycode версия кириллического домена
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Берём все chat_id из переменной окружения (через запятую)
  const chatIds = process.env.TG_CHAT_IDS.split(',').map(id => id.trim());

  try {
    // Отправляем каждому получателю отдельным запросом
    await Promise.all(
      chatIds.map(chat_id =>
        fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' })
        })
      )
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}