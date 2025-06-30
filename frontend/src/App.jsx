import
{ useState } from 'react'
import SymptomChecklist from './components/SymptomChecklist';
import './App.css'

function App() {

    const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());
    const exportPDF = async () =>{
                  const symptomArray = Array.from(selectedSymptoms)
                    console.log("Selected symptoms:", symptomArray);
                  const response= await fetch('http://localhost:8000/api/exportpdf/',{
                      method:'POST',
                      headers:{
                          'Content-Type': "application/json"
                          //'X-csrftoken':
                      },
                      body: JSON.stringify({symptoms: symptomArray}),
                      })
            if (!response.ok) {
        // handle errors
        console.error('Failed to fetch PDF');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor tag to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prediction_report.pdf'; // the filename for user
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    };


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
                  exportPDF();
          };




  return (
     <div className="App">
      <h1>Symptom Tracker</h1>
      <SymptomChecklist
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
      />
         <button onClick={exportToModel}>Export to model + PDF</button>
         <button onClick={exportPDF}>Export to PDF</button>
         <p>Hey, model’s kinda sucks it was a first time for me! </p>
         <p>this isn't substitution for a real doctor. The model also isn't good with mental illnesses</p>
    </div>


  )
};

export default App
