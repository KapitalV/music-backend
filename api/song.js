import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const r = await axios.get(
      `https://saavn.dev/api/songs/${id}`
    );

    res.status(200).json(r.data);
  } catch {
    res.status(500).json({ error: "song failed" });
  }
}
