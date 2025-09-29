export default async function handler(req, res) {
  const { address } = req.query;
  const token = process.env.RPR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Missing RPR_TOKEN in environment variables" });
  }

  try {
    const url = `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const text = await response.text(); // read raw response first

    if (!response.ok) {
      console.error("RPR API error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "RPR API did not return valid JSON", raw: text });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
