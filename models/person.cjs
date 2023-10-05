const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = 'mongodb+srv://tonilelikakis85:Koillinen200@cluster0.36ojk2i.mongodb.net/Phonebook?retryWrites=true&w=majority'
//process.env.MONGODB_UR
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {    console.log('connected to MongoDB')  })  .catch((error) => {    console.log('error connecting to MongoDB:', error.message)  })
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,

})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)



