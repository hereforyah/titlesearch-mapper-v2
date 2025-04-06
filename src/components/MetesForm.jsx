import React, { useState } from 'react';

export default function MetesForm({ onAddPoint }) {
  const [direction, setDirection] = useState('N');
  const [degrees, setDegrees] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [distance, setDistance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const bearing = `${direction} ${degrees}°${minutes}'${seconds}"`;
    onAddPoint({ bearing, distance: parseFloat(distance) });

    // Clear form
    setDegrees('');
    setMinutes('');
    setSeconds('');
    setDistance('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white rounded shadow mb-4">
      <div>
        <label className="block text-sm font-medium">Direction (N/S/E/W):</label>
        <select value={direction} onChange={(e) => setDirection(e.target.value)} className="border rounded w-full p-1">
          <option value="N">N</option>
          <option value="S">S</option>
          <option value="E">E</option>
          <option value="W">W</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <input type="number" value={degrees} onChange={(e) => setDegrees(e.target.value)} placeholder="Degrees" className="border rounded p-1 w-full" />
        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minutes" className="border rounded p-1 w-full" />
        <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="Seconds" className="border rounded p-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Distance (feet):</label>
        <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Distance" className="border rounded w-full p-1" />
      </div>
      <button type="submit" className="bg-blue-600 text-white py-1 px-3 rounded mt-2">Add Call</button>
    </form>
  );
}
