import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());

// Proxy search endpoint
app.get("/api/search", async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const response = await fetch(
      `https://api.narrpr.com/avm?address=${encodeURIComponent(address)}&token=${process.env.RPR_TOKEN}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from RPR" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
