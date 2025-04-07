import MapViewer from './components/MapViewer';
import MetesForm from './components/MetesForm';
import { useState } from 'react';

function App() {
  const [bulkInput, setBulkInput] = useState('');
  const [calls, setCalls] = useState([]);

  const handleBulkAddPoints = (newCalls) => {
    setCalls(newCalls);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Sidebar: Form */}
      <div className="md:w-96 w-full bg-white p-4 overflow-y-auto">
        <MetesForm
          onBulkAddPoints={handleBulkAddPoints}
          bulkInput={bulkInput}
          setBulkInput={setBulkInput}
        />
      </div>

      {/* Right: Map Viewer */}
      <div className="flex-1">
        <MapViewer calls={calls} unit="Feet" />
      </div>
    </div>
  );
}

export default App;
