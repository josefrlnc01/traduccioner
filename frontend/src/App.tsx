import { useState } from 'react'
import './App.css'
import FormView from './views/FormView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <FormView/>
    </>
     
  )
}

export default App
