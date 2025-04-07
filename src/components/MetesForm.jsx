import React, { useState, useEffect } from 'react';

export default function MetesForm({ onBulkAddPoints, bulkInput, setBulkInput }) {
  // State for dropdowns
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [counties, setCounties] = useState([]);

  const [principalMeridian, setPrincipalMeridian] = useState('');
  const [startingPointType, setStartingPointType] = useState('POB');
  const [unit, setUnit] = useState('Feet');
  const [notes, setNotes] = useState('');

  // Section, Township, Range
  const [section, setSection] = useState('');
  const [township, setTownship] = useState('');
  const [range, setRange] = useState('');

  // Sample state and counties data
  const stateCountyData = {
    Florida: ['Escambia', 'Santa Rosa', 'Okaloosa', 'Walton'],
    Texas: ['Harris', 'Dallas', 'Travis', 'Bexar'],
    'New York': ['Albany', 'Erie', 'Kings', 'Queens'],
  };

  const meridianOptions = [
    'Tallahassee',
    'St. Stephens',
    'Huntsville',
    'Mount Diablo',
    'Salt Lake',
    'Ute',
    'Chickasaw',
    'Choctaw',
    'Louisiana',
    'New Mexico',
    'Gila and Salt River',
    'Indian',
    'Michigan',
    'First Principal',
    'Second Principal',
    'Third Principal',
    'Fourth Principal',
    'Fifth Principal',
    'Sixth Principal',
  ];

  const unitOptions = ['Feet', 'Chains', 'Rods', 'Meters'];

  useEffect(() => {
    if (selectedState && stateCountyData[selectedState]) {
      setCounties(stateCountyData[selectedState]);
      setSelectedCounty(stateCountyData[selectedState][0]);
    } else {
      setCounties([]);
      setSelectedCounty('');
    }
  }, [selectedState]);

  const handleBulkSubmit = (e) => {
    e.preventDefault();

    const lines = bulkInput.trim().split('\n');

    const calls = lines.map(line => {
      const cleanLine = line.replace(/[\\/]/g, '').replace(/,/g, '').trim();
      const match = cleanLine.match(/([NSEW\d.]+)\s*([\d.]+)/i);

      if (!match) return null;

      const [, bearing, distance] = match;

      return {
        bearing: bearing.toUpperCase(),
        distance: parseFloat(distance),
      };
    }).filter(Boolean);

    onBulkAddPoints(calls);

    // Optional: Log the form state for future use
    console.log({
      selectedState,
      selectedCounty,
      principalMeridian,
      startingPointType,
      section,
      township,
      range,
      unit,
      notes,
    });
  };

  return (
    <form onSubmit={handleBulkSubmit} className="space-y-4 bg-white rounded shadow mb-4 p-4 text-sm">

      {/* State Selector */}
      <div>
        <label className="block font-medium mb-1">State:</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border rounded w-full p-2"
        >
          <option value="">-- Select State --</option>
          {Object.keys(stateCountyData).map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* County Selector */}
      <div>
        <label className="block font-medium mb-1">County:</label>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          className="border rounded w-full p-2"
          disabled={!selectedState}
        >
          <option value="">-- Select County --</option>
          {counties.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
      </div>

      {/* Principal Meridian */}
      <div>
        <label className="block font-medium mb-1">Principal Meridian:</label>
        <select
          value={principalMeridian}
          onChange={(e) => setPrincipalMeridian(e.target.value)}
          className="border rounded w-full p-2"
        >
          <option value="">-- Select Meridian --</option>
          {meridianOptions.map(meridian => (
            <option key={meridian} value={meridian}>{meridian}</option>
          ))}
        </select>
      </div>

      {/* Starting Point Type */}
      <div>
        <label className="block font-medium mb-1">Starting Point Type:</label>
        <select
          value={startingPointType}
          onChange={(e) => setStartingPointType(e.target.value)}
          className="border rounded w-full p-2"
        >
          <option value="POB">Point of Beginning (POB)</option>
          <option value="Commencement">Commencement Point</option>
        </select>
      </div>

      {/* Section, Township, Range */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block font-medium mb-1">Section:</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Township:</label>
          <input
            type="text"
            value={township}
            onChange={(e) => setTownship(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Range:</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
      </div>

      {/* Units of Measurement */}
      <div>
        <label className="block font-medium mb-1">Units of Measurement:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded w-full p-2"
        >
          {unitOptions.map(unitOption => (
            <option key={unitOption} value={unitOption}>{unitOption}</option>
          ))}
        </select>
      </div>

      {/* Notes / Exceptions */}
      <div>
        <label className="block font-medium mb-1">Notes / Exceptions:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any notes or exceptions here..."
          className="border rounded w-full p-2"
          rows="3"
        />
      </div>

      {/* Bulk Plot Input */}
      <div>
        <label className="block font-medium mb-1">Paste Plot Calls:</label>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Paste your plot points here, e.g. N45E 300"
          className="border rounded w-full p-2"
          rows="6"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-blue-600 text-white py-2 px-3 rounded w-full">
        Plot Calls
      </button>
    </form>
  );
}
