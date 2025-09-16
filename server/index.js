const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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

// ================= API ROUTES =================
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
  notes.push(note);
  res.json(note);
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Unknown API endpoint middleware
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

// ================= SERVE REACT FRONTEND =================
// Serve static files from Vite build (dist folder)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // React Router fallback - catch all handler
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// ================= START SERVER =================
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
