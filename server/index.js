const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods",
    important: true,
  },
];

// API endpoint
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// ✅ Use Render-provided PORT or default to 3001 locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
