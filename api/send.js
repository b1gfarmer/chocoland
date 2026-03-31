export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const { text } = req.body;

  const TG_TOKEN = process.env.TG_TOKEN;
  const CHAT_IDS = ['468139610', '757090167'];

  try {
    await Promise.all(
      CHAT_IDS.map(chat_id =>
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id,
            text,
            parse_mode: 'HTML'
          })
        })
      )
    );

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}