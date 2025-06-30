import
{ useState } from 'react'
import SymptomChecklist from './components/SymptomChecklist';
import './App.css'

function App() {

    const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());
    // Generates and downloads a PDF of the selected symptoms
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

    //Sends symptoms to backend model and triggers PDF export
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
         <button className={'export-btn'} onClick={exportToModel}>Export to model + PDF</button>
         <button className={'export-btn'} onClick={exportPDF}>Export to PDF</button>
         <p><strong>Disclaimer:</strong> This isn’t a substitute for a real doctor. Model isn't good with mental illnesses</p>


    </div>


  )
};

export default App
