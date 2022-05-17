import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import DropdownMenu from "../components/Dropdown";
import "../css/Dropdown.css"
import "../css/Home.css"
import Footer from "../components/Footer"
import chartPic from "../images/best-and-worst-closed-end-funds.jpg";

function Home() {
    return (
        <div className="home-page">
            <DropdownMenu/>
          <h1>Elite Investors Company</h1>
            <body>
            </body>
            <p>Here at Elite Investors Company, making sound and reliable investments is the key to our market domination.</p>
            <p>After selecting a stock in the top right corner, each page will display multiple visualization for data about that stock.
            The top of the page displays the current price of the stock with the indication of if the stock is currently going up or down.
                Following that, a live daily candlestick chart is shown that is updated throughout the trading day.
                The next graph shows the prediction data from the last trained model for the next 30 days (from the model training).
                The following graph shows the historical open/close data for the stock and under that is the volume over a set number of days.
            </p>
            <p>Please select a stock in the top right to get started</p>
            <footer>Elite Investors Co</footer>
            <Footer/>
        </div>
    );
}

export default Home;


// TODO: Add paragraphs stating what the project is.. what it accomplishes, how to use it, etc