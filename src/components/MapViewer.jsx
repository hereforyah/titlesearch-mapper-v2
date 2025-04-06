import React, { useEffect, useRef } from 'react';

export default function MapViewer() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.0902, lng: -95.7129 }, // Center USA
        zoom: 4,
        mapTypeControl: true,
        streetViewControl: false,
      });

      // Add example marker (you will replace this with dynamic plots!)
      new window.google.maps.Marker({
        position: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        map,
        title: "Sample Marker",
      });
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

  return (
    <div className="w-full h-screen">
      <div ref={mapRef} className="w-full h-full rounded shadow-md" />
    </div>
  );
}
