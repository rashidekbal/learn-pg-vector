import client from "../database/connection.js";
import "dotenv/config"
const addVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).send({ error: "title or description missing" });
    let text = `${title} ${description}`;
    let response = await fetch("http://localhost:8000/api/v1/embedd-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY":process.env.EMBEDDING_GENERATOR_API_KEY,
      },
      body: JSON.stringify({ text }),
    });
    response = await response.json();
    const embeddingVector = response.data.embedding;
    let query =
      "insert into videos (title,description,embedding) values($1, $2, $3)";
    await client.query(query, [
      title,
      description,
      `[${embeddingVector.join(",")}]`,
    ]);
    return res.status(200).json({ message: "Video added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

const getVideo = async (req, res) => {
  try {
    const query = req.query.target;
    if (!query)
      return res.status(400).json({ message: "please provide a valid query" });
    let response = await fetch("http://localhost:8000/api/v1/embedd-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY":process.env.EMBEDDING_GENERATOR_API_KEY,
      },
      body: JSON.stringify({ text: query }),
    });
    response = await response.json();
    const embeddingVector = response.data.embedding;
    const dbresult = await client.query(
      `select title, description from videos order by embedding <-> ($1) limit 3`,
      [`[${embeddingVector.join(",")}]`],
    );
    return res.status(200).json({ data: dbresult.rows,count:dbresult.rowCount });
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
};

export { addVideo, getVideo };
