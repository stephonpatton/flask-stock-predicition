import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSaying, setSaying] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

    useEffect(() => {
    fetch('/saying').then(res => res.json()).then(data => {
      setSaying(data.saying);
    });
  }, []);

  return (
      <div className="App">
        <header className="App-header">

          {/*... no changes in this part ...*/}
kj;jj
          <p>The current time is {currentTime}.</p>
            <p>Saying is {currentSaying}</p>
        </header>
      </div>
  );
}

export default App;