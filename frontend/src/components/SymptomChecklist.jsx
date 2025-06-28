import React, { useState } from 'react';
import symptomCategories from '../data/symptoms.json';

export default function SymptomChecklist({ selectedSymptoms, setSelectedSymptoms }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(symptomCategories)[0]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      const updated = new Set(prev);
      updated.has(symptom) ? updated.delete(symptom) : updated.add(symptom);
      return updated;
    });
  };

  return (
    <div className="Categor-btn">
      {/* Category Switch Buttons */}
      {Object.keys(symptomCategories).map(category => (
        <button key={category} onClick={() => setActiveCategory(category)}>
          {category}
        </button>
      ))}

      {/* Checklist */}
      <div className="Checklist">
        {symptomCategories[activeCategory].map(symptom => (
          <label key={symptom}>
            <input
              type="checkbox"
              checked={selectedSymptoms.has(symptom)}
              onChange={() => toggleSymptom(symptom)}
            />
            {symptom.replace(/_/g, ' ')}
          </label>
        ))}
      </div>
      <div className="Selcted">
      Selected: {Array.from(selectedSymptoms).join(', ')}
        </div>
    </div>
  );
}