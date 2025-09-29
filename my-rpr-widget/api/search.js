export default async function handler(req, res) {
  const { address } = req.query;
  const token = process.env.RPR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Missing RPR_TOKEN in environment variables" });
  }

  try {
    // RPR API endpoint
    const url = `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}`;

    console.log("Fetching RPR API:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ use token in header
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("RPR API error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
