export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Missing address parameter" });
    }

    // Make sure the token is available
    const token = process.env.RPR_API_TOKEN;
    if (!token) {
      console.error("❌ Missing RPR_API_TOKEN environment variable");
      return res.status(500).json({ error: "Server misconfiguration: missing API token" });
    }

    // Build RPR API request
    const apiUrl = `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`, // if Bearer required
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ RPR API error:", response.status, errorText);
      return res.status(response.status).json({ error: "RPR API error", details: errorText });
    }

    const data = await response.json();

    // ✅ Return the API response
    res.status(200).json(data);

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
