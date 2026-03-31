// api/send.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1️⃣ Разрешаем CORS для твоих доменов
  const allowedOrigins = [
    'https://chocoland-five.vercel.app',
    'https://шоколэнд.рус'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2️⃣ Preflight запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3️⃣ Проверяем метод
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    // 4️⃣ Отправляем в Telegram
    const response = await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_IDS.split(','), // массив ID чатов
        text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) throw new Error('Telegram API error');

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}