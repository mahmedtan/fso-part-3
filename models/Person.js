const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const chalk = require("chalk");
const uniqueValidator = require("mongoose-unique-validator");

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
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
});
personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
personSchema.plugin(uniqueValidator);

module.exports = model("Person", personSchema);
