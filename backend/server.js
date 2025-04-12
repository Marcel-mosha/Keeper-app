require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const port = process.env.PORT;
const MY_LOCAL_IP = process.env.MY_LOCAL_IP;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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

// Helper function to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth Routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send("Username already exists");
    }
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Protected Routes
app.get("/notes", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/notes", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.patch("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // First check if the note belongs to the user
    const noteCheck = await pool.query(
      "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (noteCheck.rows.length === 0) {
      return res.status(404).send("Note not found or unauthorized");
    }

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

    query += ` WHERE id = $${paramCount} AND user_id = $${
      paramCount + 1
    } RETURNING *`;
    values.push(id, req.user.id);

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.delete("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Note not found or unauthorized");
    }
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://${MY_LOCAL_IP}:${port}`);
});
