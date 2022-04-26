// import {DropdownButton} from "react-bootstrap";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';

function DropdownMenu() {
    return (
        <div>
            <h4>React-Bootstrap Dropdown Component</h4>
            <Dropdown>
                <Dropdown.Toggle variant="success">
                    Ticker Symbols
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#">
                        AAPL
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        GOOG
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        FB
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        AMZN
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        NFLX
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default DropdownMenu;