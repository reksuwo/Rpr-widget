export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      console.warn("⚠️ Missing 'address' query parameter");
      return res.status(400).json({ error: "Missing address parameter" });
    }

    // Check for API token
    const token = process.env.RPR_API_TOKEN;
    if (!token) {
      console.error("❌ RPR_API_TOKEN is missing in environment variables");
      return res.status(500).json({ error: "Server misconfiguration: API token not set" });
    }

    // Build RPR API request
    const apiUrl = `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}`;
    console.log("➡️ Sending request to RPR API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`, // some APIs may use `Token ${token}`
        "Content-Type": "application/json"
      }
    });

    // Log status code for debugging
    console.log("⬅️ RPR API response status:", response.status);

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text();
      console.error("❌ Authorization failed! Token may be invalid or expired:", errorText);
      return res.status(401).json({
        error: "Unauthorized - check your RPR_API_TOKEN",
        details: errorText
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ RPR API returned error ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: `RPR API error (status ${response.status})`,
        details: errorText
      });
    }

    // Parse successful response
    const data = await response.json();
    console.log("✅ RPR API request succeeded");

    return res.status(200).json(data);

  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
