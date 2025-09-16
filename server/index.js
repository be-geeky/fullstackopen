const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// --- Demo Notes API ---
let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generatedId = () => {
  const MaxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(MaxId + 1);
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((n) => n.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "note not found" });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generatedId(),
  };

  notes.push(note); // <--- missing in your code earlier
  res.json(note);
});

// --- Unknown API endpoint handler ---
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "unknown API endpoint" });
  }
  next();
});

// --- Serve React build ---
app.use(express.static(path.join(__dirname, "../client/build")));

// Fallback for React Router (fix for Express v5)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// --- Port handling ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
