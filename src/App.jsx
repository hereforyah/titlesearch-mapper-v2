import React from 'react';
import MapViewer from './components/MapViewer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="text-center p-4 bg-blue-600 text-white text-xl font-bold">
        TitleSearch.me Mapper v2
      </header>
      <main className="p-4">
        <MapViewer />
      </main>
    </div>
  );
}

export default App;
