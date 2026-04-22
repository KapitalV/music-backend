import axios from "axios";

const cache = new Map();

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  const key = `search_${query}`;

  if (cache.has(key)) {
    return res.status(200).json({
      source: "cache",
      data: cache.get(key),
    });
  }

  try {
    const r = await axios.get(
      `https://saavn.dev/api/search/songs?query=${query}`
    );

    cache.set(key, r.data);
    res.setHeader("Cache-Control", "s-maxage=60");

    return res.status(200).json({
      source: "api",
      data: r.data,
    });

  } catch (err) {
    if (cache.has(key)) {
      return res.status(200).json({
        source: "fallback-cache",
        data: cache.get(key),
        message: "Using cached data",
      });
    }

    return res.status(200).json({
      source: "fallback",
      data: [],
      message: "Service temporarily unavailable",
    });
  }
}
