const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const Person = require("./models/Person");
const chalk = require("chalk");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => {
  return Object.keys(req.body).length ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app
  .route("/api/persons")
  .get((req, res) => {
    Person.find({}).then((people) => res.json(people));
  })
  .post((req, res) => {
    const { name, number } = req.body;
    if (!(name && number)) {
      return res.status(400).json({ error: "name or number not provided" });
    }
    const person = new Person({
      name,
      number,
    });
    person.save().then((person) => res.status(201).json(person));
  });

app
  .route("/api/persons/:id")
  .get((req, res) => {
    const { id } = req.params;
    Person.findById(id).then((person) => {
      if (!person) return res.status(404).end();
      return res.json(person);
    });
  })
  .delete((req, res) => {
    const { id } = req.params;

    Person.findById(id).then((person) => {
      if (!person) return res.status(404).end();
    });

    Person.findByIdAndDelete(id).then((person) => res.status(202).json(person));
  });

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info ${persons.length} people<br/>${Date()}</p>`);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ` + chalk.magenta(PORT));
});
