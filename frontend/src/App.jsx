import
{ useState } from 'react'
import SymptomChecklist from './components/SymptomChecklist';
import './App.css'

function App() {

    const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());

    const exportToModel = async () =>{
              const symptomArray = Array.from(selectedSymptoms)
                console.log("Selected symptoms:", symptomArray);
              const response= await fetch('http://localhost:8000/api/predict/',{
                  method:'POST',
                  headers:{
                      'Content-Type': "application/json"
                      //'X-csrftoken':
                  },
                  body: JSON.stringify({symptoms: symptomArray}),
                  });
                  const data = await response.json();
                  console.log('Model response:', data);
          };
  return (
     <div className="App">
      <h1>Symptom Tracker</h1>
      <SymptomChecklist
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
      />
         <button onClick={exportToModel}>Export</button>
    </div>


  )
}

export default App
