import React, { useEffect, useState } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import { io } from 'socket.io-client';

import './App.css';

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const socket = io();

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        socket.emit('location', [latitude, longitude]);
      },
      () => alert("Couldn't get your geolocation :(")
    );

    socket.on('location', data => {
      setLocations(prev => [...prev, ...data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className='App'>
      <Map defaultCenter={[20, 0]} defaultZoom={3}>
        <ZoomControl />
        {locations.map(l => (
          <Marker width={50} anchor={l} key={l.join()} />
        ))}
      </Map>
    </div>
  );
}

export default App;
