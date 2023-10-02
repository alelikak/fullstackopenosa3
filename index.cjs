





let notes = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]




const express = require('express')
const morgan = require('morgan');
const app = express()


app.use(morgan('tiny'));  //https://www.digitalocean.com/community/tutorials/nodejs-getting-started-morgan

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(notes)
})


app.get('/info', (req, res) => {
    
      res.send('Phonebook has info for '+notes.length+' people.')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {    response.json(note)  } else {    response.status(404).end()  }})

  
  
  app.use(express.json())
  




 

  app.post('/api/persons', (request, response) => {
    const body = request.body
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
      id: Math.random()
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
