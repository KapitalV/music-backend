import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const search = await axios.get(
      `https://saavn.dev/api/search/songs?query=${query}`
    );

    const firstSong = search.data?.data?.results?.[0];

    if (!firstSong) {
      return res.status(404).json({ error: "No song found" });
    }

    return res.status(200).json({
      title: firstSong.name,
      artist: firstSong.primaryArtists,
      image: firstSong.image?.[2]?.url,
      url: firstSong.downloadUrl?.[4]?.url
    });

  } catch {
    res.status(500).json({ error: "Failed to fetch song" });
  }
}
