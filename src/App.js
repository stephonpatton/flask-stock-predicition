import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import DropdownMenu from "./Dropdown";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSaying, setSaying] = useState(0);
  const [currentModel, setModel] = useState(0);


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

    useEffect(() => {
    fetch('/models').then(res => res.json()).then(data => {
      console.log(data);
      console.log(data.models);
      setModel(data);
    });
  }, []);

    return (
      <div className="App">
        <header className="App-header">
          <DropdownMenu/>
           {/*FIGURE OUT ISSEU */}
            <p>The current model is {JSON.stringify(currentModel["models"], null, 2)} {currentModel.id}</p>
            <p>The current time is {currentTime}.</p>
            <p>Saying is {currentSaying}</p>
        </header>
      </div>
  );
}

export default App;