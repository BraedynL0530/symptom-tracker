import
{ useState } from 'react'

import SymptomChecklist from './components/SymptomChecklist';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
     <div className="App">
      <h1>Symptom Tracker</h1>
      <SymptomChecklist />
=    </div>
  )
}

export default App
