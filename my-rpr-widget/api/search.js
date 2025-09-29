export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ 
        error: true,
        message: "Missing address parameter"
      });
    }

    const token = process.env.RPR_API_TOKEN;
    if (!token) {
      return res.status(500).json({
        error: true,
        message: "Server misconfiguration: API token not set"
      });
    }

    const apiUrl = `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}`;
    console.log("➡️ Sending request to RPR API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`, // adjust if RPR needs "Token " prefix
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text();
      return res.status(401).json({
        error: true,
        message: "Authorization failed: Invalid or expired RPR_API_TOKEN",
        details: errorText
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: true,
        message: `RPR API error (status ${response.status})`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json({ error: false, data });

  } catch (err) {
    return res.status(500).json({ 
      error: true,
      message: "Internal server error",
      details: err.message 
    });
  }
}
