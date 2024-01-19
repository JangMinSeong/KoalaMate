import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/hello')
    .then(response => {
      setMessage(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Server says: {message}</p>
      </header>
    </div>
  );
}

export default App;
