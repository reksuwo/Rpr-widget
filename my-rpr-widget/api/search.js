export default async function handler(req, res) {
  const { address } = req.query;
  const token = process.env.RPR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Missing RPR_TOKEN in environment variables" });
  }

  try {
    const response = await fetch(
      `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}&token=${token}`
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RPR API error ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err.message });
  }
}
