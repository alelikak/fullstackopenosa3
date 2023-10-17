





let notes = []




const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
//require('dotenv').config()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError')
  {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)
app.use(morgan('tiny'))  //https://www.digitalocean.com/community/tutorials/nodejs-getting-started-morgan

morgan.token('body', function(req, res) {
  return req.body
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  //https://www.atatus.com/blog/a-beginners-guide-to-morgan-npm-logger/


const Person = require('./models/person.cjs')

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
    notes=persons
  })

})


app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: body.id,

  })

  person.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => { console.log(result)
      response.status(204).end()
    }).catch(error => next(error))

})




app.put('/api/persons/:id', (request, response,next) => {
  const { name,number, id } = request.body
  Person.findByIdAndUpdate(request.params.id,    { name,number,id },    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
})




app.get('/info', (req, res) => {
  res.send('Phonebook has info for '+notes.length+' people.'+'<p>'+new Date() +'</p>') //Source https://stackoverflow.com/questions/46931656/how-to-send-date-when-submitting-a-form-with-node-js-and-express
})



app.use(errorHandler)
app.use(unknownEndpoint)
/*
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {    response.json(note)  } else {    response.status(404).end()  }})
*/


/*
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('request.body',request.body)

    let names = notes.map(person=>person.name)
    if (!body.name||!body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }
    else if(names.includes(body.name)){ //https://stackoverflow.com/questions/237104/how-do-i-check-if-an-array-includes-a-value-in-javascript

    return response.status(400).json({
      error: 'name is already on the list'
    })}


    let note = {
      name: body.name,
      number: body.number,
      id: body.id
      //id:  Math.floor(Math.random() * 100) + 1 //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript

    }

    notes = notes.concat(note)

    response.json(note)
  })
*/
/*

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })
*/


//const PORT = process.env.PORT || 3001
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


