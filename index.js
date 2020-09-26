const express = require("express");
const PORT = process.env.PORT;
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("body", (req, res) => {
  return Object.keys(req.body).length ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const persons = [
  { id: 1, name: "Dave", number: "092-6455767" },
  { id: 2, name: "Boogie", number: "092-6353437" },
  { id: 3, name: "Drake", number: "092-9778335" },
  { id: 4, name: "Scott", number: "092-32357943" },
  { id: 5, name: "Anastasia", number: "092-08967643" },
  { id: 6, name: "Rabel", number: "092-78665434" },
];
app
  .route("/api/persons")
  .get((req, res) => {
    res.json(persons);
  })
  .post((req, res) => {
    const { name, number } = req.body;
    if (!(name && number)) {
      return res.status(400).json({ error: "name or number not provided" });
    } else if (persons.find((p) => p.name === name)) {
      return res.status(409).json({ error: "name must be unique" });
    }

    const person = {
      name,
      number,
      id: Math.floor(Math.random() * (1000 - 100) + 100),
    };
    persons.push(person);
    return res.status(201).json(person);
  });

app
  .route("/api/persons/:id")
  .get((req, res) => {
    const { id } = req.params;
    const person = persons.find((person) => person.id === Number(id));
    return person ? res.json(person) : res.status(404).end();
  })
  .delete((req, res) => {
    const { id } = req.params;

    if (!persons.find((person) => person.id === Number(id)))
      return res.status(404).end();

    return res
      .status(202)
      .json(
        persons.splice(
          persons.indexOf(persons.find((person) => person.id === Number(id))),
          1
        )[0]
      );
  });

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info ${persons.length} people<br/>${Date()}</p>`);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
