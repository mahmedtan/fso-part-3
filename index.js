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
  .get((req, res, next) => {
    Person.find({})
      .then((people) => res.json(people))
      .catch((error) => {
        next(error);
      });
  })
  .post((req, res, next) => {
    const { name, number } = req.body;
    if (!(name && number)) {
      return res.status(400).json({ error: "name or number not provided" });
    }
    const person = new Person({
      name,
      number,
    });
    person
      .save()
      .then((person) => res.status(201).json(person))
      .catch((error) => {
        next(error);
      });
  });

app
  .route("/api/persons/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    Person.findById(id)
      .then((person) => {
        if (person) res.json(person);
        else res.status(404).end();
      })
      .catch((error) => {
        next(error);
      });
  })
  .delete((req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then((person) => {
        if (person) res.status(204).json(person);
        else res.status(404).end();
      })
      .catch((error) => {
        next(error);
      });
  })
  .put((req, res, next) => {
    const { params, body } = req;
    Person.findByIdAndUpdate(params.id, body, {
      new: true,
    })
      .then((person) => {
        if (person) res.json(person);
        else res.status(404).end();
      })
      .catch((error) => {
        next(error);
      });
  });

app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    res.send(
      `<p>Phonebook has info about ${people.length} people<br/>${Date()}</p>`
    );
  });
});

app.use((error, req, res, next) => {
  console.log(chalk.bgRed(error.message));
  if (error.name === "CastError")
    res.status(400).json({ error: "malformed id" });
  else if (error.name === "ValidationError")
    res.status(400).json({ error: error.message });
  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ` + chalk.magenta(PORT));
});
