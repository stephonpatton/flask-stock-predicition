// import {DropdownButton} from "react-bootstrap";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import "../css/Dropdown.css"

function DropdownMenu() {
    return (
        <div className="dropdown-div">
            <Dropdown>
                <Dropdown.Toggle variant="success">
                    Ticker Symbols
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/aapl">
                        AAPL
                    </Dropdown.Item>
                    <Dropdown.Item href="/goog">
                        GOOG
                    </Dropdown.Item>
                    <Dropdown.Item href="/fb">
                        FB
                    </Dropdown.Item>
                    <Dropdown.Item href="/amzn">
                        AMZN
                    </Dropdown.Item>
                    <Dropdown.Item href="/nflx">
                        NFLX
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default DropdownMenu;