import React, { useCallback, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

// Helper to calculate next point based on bearing and distance
const calculateNextPoint = (start, call) => {
  const { bearing, distance } = call;

  const bearingParts = bearing.match(/([NSEW\d.]+)/);
  if (!bearingParts) return start;

  const direction = bearingParts[1].toUpperCase();
  const distanceInDegrees = distance / 364000;

  let nextPoint = { ...start };

  if (direction.startsWith('N')) nextPoint.lat += distanceInDegrees;
  if (direction.startsWith('S')) nextPoint.lat -= distanceInDegrees;
  if (direction.endsWith('E')) nextPoint.lng += distanceInDegrees;
  if (direction.endsWith('W')) nextPoint.lng -= distanceInDegrees;

  return nextPoint;
};

export default function MapViewer({ calls = [] }) {
  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = useMemo(() => ({ lat: 37.0902, lng: -95.7129 }), []);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBrdaAuBJa-ATke8nVoxSx5Q3dkmOzi9NM',
  });

  const path = useMemo(() => {
    const points = [center];
    calls.forEach(call => {
      const nextPoint = calculateNextPoint(points[points.length - 1], call);
      points.push(nextPoint);
    });
    return points;
  }, [calls, center]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    if (path.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
  }, [path]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={4}
      onLoad={onMapLoad}
    >
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
