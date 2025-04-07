import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { point as turfPoint, destination as turfDestination } from '@turf/turf';

// Convert bearing string (e.g., "N45E") to degrees
const parseBearingToDegrees = (bearingStr) => {
  const clean = bearingStr.trim().toUpperCase();

  let angle = 0;
  const match = clean.match(/^([NS])(\d+(?:\.\d+)?)([EW])$/);

  if (match) {
    const [, ns, degrees, ew] = match;
    angle = parseFloat(degrees);

    if (ns === 'N' && ew === 'E') angle = angle;
    else if (ns === 'S' && ew === 'E') angle = 180 - angle;
    else if (ns === 'S' && ew === 'W') angle = 180 + angle;
    else if (ns === 'N' && ew === 'W') angle = 360 - angle;
  } else {
    if (clean === 'N') angle = 0;
    else if (clean === 'E') angle = 90;
    else if (clean === 'S') angle = 180;
    else if (clean === 'W') angle = 270;
  }

  return angle;
};

// Calculate next point using turf.js
const calculateNextPoint = (start, call) => {
  const from = turfPoint([start.lng, start.lat]);
  const bearing = parseBearingToDegrees(call.bearing);
  const distanceInMiles = call.distance / 5280; // Convert feet to miles

  const destination = turfDestination(from, distanceInMiles, bearing, { units: 'miles' });
  const [lng, lat] = destination.geometry.coordinates;

  return { lat, lng };
};

export default function MapViewer({ calls = [] }) {
  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const defaultCenter = { lat: 30.3958, lng: -86.8561 }; // General NW Florida
  const [origin, setOrigin] = useState(defaultCenter);
  const mapRef = useRef(null);

  const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: VITE_GOOGLE_MAPS_API_KEY,
  });

  // Build the path based on calls and origin
  const path = useMemo(() => {
    const points = [origin];
    calls.forEach(call => {
      const nextPoint = calculateNextPoint(points[points.length - 1], call);
      points.push(nextPoint);
    });
    return points;
  }, [calls, origin]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    if (path.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
  }, [path]);

  const handleMapClick = useCallback((event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    setOrigin({ lat: clickedLat, lng: clickedLng });

    // Optional: Zoom in when setting new origin
    if (mapRef.current) {
      mapRef.current.panTo({ lat: clickedLat, lng: clickedLng });
      mapRef.current.setZoom(15);
    }
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={origin}
      zoom={10}
      onLoad={onMapLoad}
      onClick={handleMapClick} // 🎉 Click-to-set origin!
    >
      {/* Origin Marker */}
      <Marker position={origin} label="Origin" />

      {/* Path Line and Markers */}
      {path.length > 1 && (
        <>
          <Polyline
            path={path}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
          {path.map((point, index) => (
            <Marker
              key={index}
              position={point}
              label={`P${index + 1}`}
            />
          ))}
        </>
      )}
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
}
