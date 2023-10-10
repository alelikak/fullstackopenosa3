const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = 'mongodb+srv://tonilelikakis85:Koillinen200@cluster0.36ojk2i.mongodb.net/Phonebook?retryWrites=true&w=majority'
//const url =process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {    console.log('connected to MongoDB',result)}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)  })

const personSchema = new mongoose.Schema({
  name: { type: String,  minlength: 3,required: true },
  number:{ type: String,minlength: 8,required: true,validate: { //Source: https://mongoosejs.com/docs/validation.html#custom-validators
    validator: function(v) {
      return /\d{2,3}-\d{4,}/.test(v)   //Source: https://regex101.com/
    },
    message: props => `${props.value} should have at least 8 numbers and - after first 2 or 3 numbers!`
  },
  },
  id: String,

})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)



