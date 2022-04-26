import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import './css/Dropdown.css'
import DropdownMenu from "./pages/Dropdown";
import Home from "./pages/Home"
import Amazon from "./pages/Amazon"
import Apple from "./pages/Apple"
import Facebook from "./pages/Facebook"
import Google from "./pages/Google"
import Netflix from "./pages/Netflix"

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

function App() {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSaying, setSaying] = useState(0);
    const [currentModel, setModel] = useState(0);
    const [currentTicker, setTicker] = useState(0);

    useEffect(() => {
        fetch('/aapl').then(res => res.json()).then(data => {
            setTicker("AAPL");
        });
    }, []);

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
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/aapl" element={<Apple/>}/>
                    <Route exact path="/goog" element={<Google/>}/>
                    <Route exact path="/nflx" element={<Netflix/>}/>
                    <Route exact path="/amzn" element={<Amazon/>}/>
                    <Route exact path="/fb" element={<Facebook/>}/>
                </Routes>
            </Router>
        </div>

    );
}

export default App;


{/*<div className="App">*/
}
{/*    <header className="App-header">*/
}
{/*        <div className="dropdown-div">*/
}
{/*            <DropdownMenu/>*/
}
{/*        </div>*/
}
{/*        /!*FIGURE OUT ISSEU *!/*/
}
{/*        <p>The current model is {JSON.stringify(currentModel["models"], null, 2)} {currentModel.id}</p>*/
}
{/*        <p>The current time is {currentTime}.</p>*/
}
{/*        <p>Saying is {currentSaying}</p>*/
}
{/*    </header>*/
}
{/*</div>*/
}