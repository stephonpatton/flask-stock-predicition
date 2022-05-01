import React, {useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../css/Dropdown.css"
import DropdownMenu from "./Dropdown";
import Chart from 'react-apexcharts'


const googData = 'https://yahoo-finance-api.vercel.app/goog';
async function getData() {
    const response = await fetch(googData);
    return response.json();
}

const directionEmojis = {
    up: '🚀',
    down: '💩',
    '': '',
};


const chart = {
    options: {
        chart: {
            height: 400,
            type: 'line',
            zoom: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        // stroke: {
        //     width: 5,
        //     curve: 'straight'
        // },
        title: {
            text: 'Product Trends by Month',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            type: 'datetime'
        }
    },

};

const round = (number) => {
    return number ? +(number.toFixed(2)) : null;
};



function Google() {
    const [series, setSeries] = useState([{
        data: []
    }]);
    const [price, setPrice] = useState(-1);
    const [prevPrice, setPrevPrice] = useState(-1);
    const [priceTime, setPriceTime] = useState(null);

    useEffect(() => {
        let timeoutId;
        async function getLatestPrice() {
            try {
                const data = await getData();
                console.log(data);
                const goog = data.chart.result[0];
                setPrevPrice(price);
                setPrice(goog.meta.regularMarketPrice.toFixed(2));
                setPriceTime(new Date(goog.meta.regularMarketTime * 1000));
                const quote = goog.indicators.quote[0];
                const prices = goog.timestamp.map((timestamp, index) => ({
                    x: new Date(timestamp * 1000),
                    y: [quote.open[index], quote.high[index], quote.low[index], quote.close[index]].map(round)
                }));
                setSeries([{
                    data: prices,
                }]);
            } catch (error) {
                console.log(error);
            }
            timeoutId = setTimeout(getLatestPrice, 5000 * 2);
        }

        getLatestPrice();

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const direction = useMemo(() => prevPrice < price ? 'up' : prevPrice > price ? 'down' : '', [prevPrice, price]);


    return (
        <div>
            <DropdownMenu/>
            <div className={['price', direction].join(' ')}>
                {/*${price}*/}
                ${price} {directionEmojis[direction]}
            </div>
            <div className="price-time">
                {priceTime && priceTime.toLocaleTimeString()}
            </div>
            <Chart options={chart.options} series={series} type="line" width="100%" height={350} />
        </div>
        //
        // TODO: body of text explaining apple stock, project etc
        // TODO: Graph showing stock
        // TODO: Other visualizations
        // TODO: Buy or sell indicator
        // TODO: Fix gaps in chart
        // TOOD: Add more to chart
        // TODO: Add custom points to chart
        // Apple PAGE CUHHHHH
    );
}

export default Google;

// TODO: Buy or sell indicator
// TODO: Candle sticks for daily stock prices
// TODO: Past 30, 60, 90, 120 days stock prices
// TODO: Line chart with predictions (30 days)
// TODO: Some other representation of physical numbers for predicted 30 day data (either chart or paragraph)