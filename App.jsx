import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './notes'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="alert">
      {message}
    </div>
    
  )
}
const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
    
  )
}

const Filter = (props) => {
  return (
<div>filter shown with: <input value={props.filter} onChange={props.eventhandler}/></div>
)
}


const PersonForm = (props) => {
  return (

<form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newNote} onChange={props.handleNoteChange}/>

        </div>
        <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

)
}

const Persons = ({deletePerson,personsToShow}) => {
  const baseUrl = 'http://localhost:3001/api/persons'
  return (



<div>{personsToShow.map(person => <li className='person' key={person.name}>  <p>{person.name}{" "} {person.number}{" "} <button name={person.name} id={person.id}  onClick={deletePerson}>delete</button></p> </li>)} </div>
//Source https://stackoverflow.com/questions/52034868/confirm-window-in-react
)
}




const App = () => {
  const [alertMessage, setAlertMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [persons, setPersons] = useState([])
  
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNote, setNewNote] = useState(    'a new note...'  ) 
  const [newNumber, setNewNumber] = useState(    ''  ) 
  const [showAll, setShowAll] = useState(true)
  
  const deletePerson = (event) => {
     event.preventDefault()
    console.log('button id',event.target.id)

     if (window.confirm(`Delete ${event.target.name} ?`)) {

      personService.poista(event.target.id).then(response => {setAlertMessage( `Deleted '${event.target.name}' `)       
      setTimeout(() => {setAlertMessage(null)}, 5000)}).catch(alert => {})
      console.log('deletePerson eventtia kutsuttiin')
    }




  }

  const addPerson = (event) => {
    event.preventDefault()
    const arr = persons.map(person=>person.id);
    const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    console.log(`Suurin id listassa `,max)
    //Poistettaessa puh.nroita listan ensimmaisen henkilon id saattaa olla yhta suuri kuin lisattavan henkilon id, jolloin ohjelma ei lisaa henkiloa, jos kaytetaan kurssimateriaalin persons.length + 1 id:na

    const personObject = {
      name: newNote,
      number:newNumber,
      id: max + 1,
    }


    //if (persons[0].id!=1 && persons.length>0) {
    //  personObject.id=personObject.id+1
    //}

    const check = (element) => element.name === newNote;
    const note =persons.find(person => person.name === newNote)
    if (note) {




    if(window.confirm(`${newNote} is already added to phonebook, replace the old one with a new one?`))
    {

    const newObject = {
      name: note.name,
      number:newNumber,
      id: note.id,
    }
    console.log(newObject)

    personService
       .update(note.id, newObject).then(returnedNote => {
         setPersons(persons.map(person => person.id !== id ? person : returnedNote))
         console.log('Update alert toimii 1')
         
       }).catch(alert => {   //https://stackoverflow.com/questions/68970650/how-to-show-success-or-error-message-based-on-the-response-of-the-api-in-react-j
        if(alert.message!=='Request failed with status code 404'){
          setAlertMessage( `Updated '${newNote}' `) 
          setTimeout(() => {setAlertMessage(null)}, 5000)
        }
        else{
          setErrorMessage( `Information of '${newNote}' has already been removed from server`) 
              
       setTimeout(() => {setErrorMessage(null)}, 5000)
      }
       console.log('Update alert toimii 2')})
        //Source https://fullstackopen.com/osa2/tyylien_lisaaminen_react_sovellukseen
       setNewNote('')
       setNewNumber('')
      }else
      {// window confirm cancel 
      }

}
  else
  {
    console.log('Create new name',personObject,'persons.length ', persons.length)
    setPersons(persons.concat(personObject))

    personService.create(personObject).then(response => {setAlertMessage( `Added '${newNote}' `);  setTimeout(() => {setAlertMessage(null)}, 5000)  }).catch(error => {
       console.log(error.response.data)
       setErrorMessage(error.response.data ) 
              
       setTimeout(() => {setErrorMessage(null)}, 5000)
    })
    setNewNote('')
    setNewNumber('')
  }










  }

  //https://fullstackopen.com/osa2/palvelimella_olevan_datan_hakeminen
  useEffect(() => {      console.log('effect')    
  personService.getAll().then(response => {setPersons(response.data)})

   }, [persons])  
  //Kun ylla olevaan taulukkoon laittaa muuttujan persons, niin renderointi sivuilla tapahtuu reaaliaikaisesti, muutem vain lisaamisen on reaaliaikaista, poistamisessa ja paivittamisessa pitaa painaa selaimen paivitysnappia
   console.log('render', persons.length, 'notes')



  const personsToShow = showAll    ? persons    : persons.filter(person => person.important === true)
  const personsToShow2 = newFilter    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())):persons
   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
   //https://stackoverflow.com/questions/48979908/react-filter-function-case-insensitive

  const handleNoteChange = (event) => {    console.log(event.target.value)    
    setNewNote(event.target.value)  }
  const handleNumberChange = (event) => {    console.log(event.target.value)    
    setNewNumber(event.target.value)  }
  const handleFilterChange = (event) => {    console.log(event.target.value)    
    setNewFilter(event.target.value)  }





  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage} />
      <Error message= {errorMessage}/>


      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newNote={newNote}  handleNoteChange={handleNoteChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <div>debug: {newName}</div>
      <h3>Numbers</h3>

      <Persons deletePerson={deletePerson}  personsToShow={personsToShow2}/>
        </div>

  )

}

export default App
