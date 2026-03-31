export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { text } = req.body;
  const TG_TOKEN = process.env.TG_TOKEN;
  const TG_CHAT_IDS = JSON.parse(process.env.TG_CHAT_IDS);

  try {
    await Promise.all(
      TG_CHAT_IDS.map(chat_id =>
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' })
        })
      )
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
}