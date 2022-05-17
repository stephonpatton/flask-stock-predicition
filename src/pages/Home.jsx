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
            <p>In order to do that, we must advance our field using Machine Learning to make reliable and accurate predictions when investing.</p>
            <p>After selecting a stock in the top right corner, each page will display multiple visualization for data about that stock.
            <p>The top of the page displays the current price of the stock with the indication of if the stock is currently going up or down.</p>
            <p>Following that, a live daily candlestick chart is shown that is updated throughout the trading day.</p>
            <p>The next graph shows the prediction data from the last trained model for the next 30 days (from the model training).</p>
            <p>The following graph shows the historical open/close data for the stock and under that is the volume over a set number of days.</p>
            <p></p>

            </p>
            <br></br>
            <br></br>
            <br></br>
            <p><b>The models will need to be retrained every 30 days in order to provide new predictions.</b><br></br> This can be done
            using the provided notebooks. The models are trained using a LSTM network, which is highly accurate and great for time series predictions.
            </p>
            <p>This project was built using React, JavaScript, HTML, CSS, and Python</p>
            <p><b>Please select a stock in the top right to get started</b></p>
            <Footer/>
        </div>
    );
}

export default Home;


// TODO: Add paragraphs stating what the project is.. what it accomplishes, how to use it, etc