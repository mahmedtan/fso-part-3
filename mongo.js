const mongoose = require("mongoose");
const { Schema, model } = mongoose;

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://mahmedtan:${password}@cluster0.if8ur.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
});

const Person = model("Person", personSchema);

const [, , , name, number] = process.argv;

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(({ name, number }) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((People) => {
    console.log("phonebook:");

    People.forEach(({ name, number }) => console.log(`${name} ${number}`));
    mongoose.connection.close();
  });
}
