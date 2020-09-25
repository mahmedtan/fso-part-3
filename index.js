const express = require("express");
const PORT = 3001;
const app = express();
const persons = [
  { id: 1, name: "Dave", number: "092-6455767" },
  { id: 2, name: "Boogie", number: "092-6353437" },
  { id: 3, name: "Drake", number: "092-9778335" },
  { id: 4, name: "Scott", number: "092-32357943" },
  { id: 5, name: "Anastasia", number: "092-08967643" },
  { id: 6, name: "Rabel", number: "092-78665434" },
];
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
