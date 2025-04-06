import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import MetesForm from './components/MetesForm';

function App() {
  const [calls, setCalls] = useState([]);

  const handleAddPoint = (call) => {
    setCalls([...calls, call]);
    console.log('Added call:', call); // For now, log to check input
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="text-center p-4 bg-blue-600 text-white text-xl font-bold">
        TitleSearch.me Mapper v2
      </header>
      <main className="p-4 flex">
        <div className="w-1/3">
          <MetesForm onAddPoint={handleAddPoint} />
        </div>
        <div className="w-2/3">
          <MapViewer calls={calls} />
        </div>
      </main>
    </div>
  );
}

export default App;
