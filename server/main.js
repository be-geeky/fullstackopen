const express = require("express");
var morgan = require("morgan");
const app = express();
app.use(morgan("common"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    res.send(person);
  } else {
    res.errorMessage = "person not found";
    res.status(404).end();
  }
});
app.delete("/api/persons/delete/:id", (req, res) => {
  persons = persons.filter((p) => p.id !== req.params.id);
  res.json(persons);
  res.status(204).end();
});
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "name or number is missing!",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    res.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: Math.floor(Math.random() * 999999),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.status(201).json(persons);
});
app.get("/info", (req, res) => {
  res.send(`The phonebook has ${persons.length} entries <br /> ${new Date()}`);
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
