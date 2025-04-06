import React, { useEffect, useRef } from 'react';

// Helper to calculate next point based on bearing and distance
const calculateNextPoint = (start, call) => {
  const { bearing, distance } = call;

  // Convert DMS bearing to decimal degrees (very basic for demo!)
  const bearingParts = bearing.match(/([NSEW])\\s*(\\d+)°(\\d+)'(\\d+)"/);
  if (!bearingParts) return start;

  const [, direction, deg, min, sec] = bearingParts.map((part, index) => index === 0 ? part : parseFloat(part));
  const decimalDegrees = deg + min / 60 + sec / 3600;

  const distanceInDegrees = distance / 364000; // Roughly convert feet to degrees (adjust later)

  let nextPoint = { ...start };

  if (direction === 'N') nextPoint.lat += distanceInDegrees;
  if (direction === 'S') nextPoint.lat -= distanceInDegrees;
  if (direction === 'E') nextPoint.lng += distanceInDegrees;
  if (direction === 'W') nextPoint.lng -= distanceInDegrees;

  return nextPoint;
};

export default function MapViewer({ calls }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.0902, lng: -95.7129 },
        zoom: 4,
        mapTypeControl: true,
        streetViewControl: false,
      });

      polylineRef.current = new window.google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      polylineRef.current.setMap(mapInstance.current);
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBrdaAuBJa-ATke8nVoxSx5Q3dkmOzi9NM`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !polylineRef.current) return;

    const start = { lat: 37.0902, lng: -95.7129 }; // Center point
    const path = [start];

    calls.forEach(call => {
      const next = calculateNextPoint(path[path.length - 1], call);
      path.push(next);
    });

    polylineRef.current.setPath(path);
    if (path.length > 1) {
      mapInstance.current.setCenter(path[path.length - 1]);
      mapInstance.current.setZoom(16); // Zoom closer as points are added
    }
  }, [calls]);

  return (
    <div className="w-full h-screen">
      <div ref={mapRef} className="w-full h-full rounded shadow-md" />
    </div>
  );
}
