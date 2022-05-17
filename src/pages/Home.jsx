import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import DropdownMenu from "./Dropdown";
import "../css/Dropdown.css"

function Home() {
    return (
        <div>
            <DropdownMenu/>
          <h1>Elite Investors Company</h1>
            <body>
            Here at Elite Investors Company, making sound and reliable investments is the key to our market domination.
            </body>
            <p>Please select a stock in the top right to get started
            </p>
            <footer>Elite Investors Co</footer>
        </div>
    );
}

export default Home;


// TODO: Add paragraphs stating what the project is.. what it accomplishes, how to use it, etc