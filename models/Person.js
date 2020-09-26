const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const chalk = require("chalk");

console.log("Connecting to MongoDB Atlas");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log(chalk.white.green("Connected to MongoDB Atlas")))
  .catch(({ message }) =>
    console.log(chalk.red("Error connecting to MongoDB", message))
  );

const personSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
});
personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = model("Person", personSchema);
