

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)

  
}
const password = process.argv[2]



const url =
  `mongodb+srv://tonilelikakis85:Koillinen200@cluster0.36ojk2i.mongodb.net/Phonebook?retryWrites=true&w=majority`  // Source https://stackoverflow.com/questions/55695565/error-message-mongoerror-bad-auth-authentication-failed-through-uri-string
  
  
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length===3){
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name,person.number)
    })
    mongoose.connection.close()
  })
}


if (process.argv.length>3){
const pname = process.argv[3]
const pnumber = process.argv[4]


const note = new Person({
  name: pname,
  number: pnumber,
  id: Math.floor(Math.random() * 100) + 1, //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
})

note.save().then(result => {
  console.log('added ',pname,' ', pnumber,' to phonebook')
  mongoose.connection.close()
})}
