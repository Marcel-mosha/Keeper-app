require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT;
const MY_LOCAL_IP = process.env.MY_LOCAL_IP;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.164:3000"],
  })
);

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Routes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.patch("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Build the update query dynamically based on what's provided
    let query = "UPDATE notes SET";
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      query += ` title = $${paramCount++}`;
      values.push(title);
    }

    if (content !== undefined) {
      if (values.length > 0) query += ",";
      query += ` content = $${paramCount++}`;
      values.push(content);
    }

    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://${MY_LOCAL_IP}:${port}`);
});
