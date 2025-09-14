import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Proxy endpoint
app.post("/translate", async (req, res) => {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*"); // fix CORS
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

app.listen(3000, () => console.log("✅ Proxy running at http://localhost:3000"));
