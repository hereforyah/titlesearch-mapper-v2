import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import MetesForm from './components/MetesForm';

function App() {
  const [calls, setCalls] = useState([]);
  const [bulkInput, setBulkInput] = useState('');


  const clearMap = () => {
    setCalls([]);
    setBulkInput('');
  };
  
  

  const handleBulkAddPoints = (newCalls) => {
    setCalls(newCalls);
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-80 bg-white p-4 shadow flex flex-col">
  <h1 className="text-lg font-bold mb-4 text-blue-600">TitleSearch.me Mapper v2</h1>
  <MetesForm
  onBulkAddPoints={handleBulkAddPoints}
  bulkInput={bulkInput}
  setBulkInput={setBulkInput}
/>

        <div className="mt-4">
          <button
            onClick={clearMap}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
      Clear Map
    </button>
  </div>
</div>

      
      {/* Right Panel (Map Full Width) */}
      <div className="flex-1">
        <MapViewer calls={calls} />
      </div>
    </div>
  );
}

export default App;
