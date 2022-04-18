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
                    Open Menu
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#">
                        Home Page
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        Settings
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default DropdownMenu;