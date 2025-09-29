// /api/search.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const response = await fetch(
      `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}&token=${process.env.RPR_TOKEN}`
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON from RPR", raw: text });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("RPR fetch error:", err);
    res.status(500).json({ error: "Failed to fetch data from RPR" });
  }
}
