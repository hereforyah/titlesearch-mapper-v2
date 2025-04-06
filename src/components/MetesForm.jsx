import React, { useState } from 'react';

export default function MetesForm({ onBulkAddPoints }) {
  const [bulkInput, setBulkInput] = useState('');

  const handleBulkSubmit = (e) => {
    e.preventDefault();

    const lines = bulkInput.trim().split('\n');

    const calls = lines.map(line => {
      // Basic cleanup: remove slashes, commas, extra spaces
      const cleanLine = line.replace(/[\\/]/g, '').replace(/,/g, '').trim();

      // Match direction and distance
      const match = cleanLine.match(/([NSEW\d.]+)\s*([\d.]+)/i);

      if (!match) return null;

      const [, bearing, distance] = match;

      return {
        bearing: bearing.toUpperCase(),
        distance: parseFloat(distance),
      };
    }).filter(Boolean); // Remove nulls

    onBulkAddPoints(calls);

    // Clear form
    setBulkInput('');
  };

  return (
    <form onSubmit={handleBulkSubmit} className="space-y-2 p-4 bg-white rounded shadow mb-4">
      <label className="block text-sm font-medium mb-1">Paste Bulk Plot Data:</label>
      <textarea
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
        placeholder="Paste your plot points here..."
        className="border rounded w-full p-2 text-sm"
        rows="10"
      />
      <button type="submit" className="bg-blue-600 text-white py-1 px-3 rounded mt-2 w-full">
        Plot Calls
      </button>
    </form>
  );
}