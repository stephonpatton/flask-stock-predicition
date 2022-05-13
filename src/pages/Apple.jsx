// https://finnhub.io/dashboard

import React, {useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../css/Dropdown.css"
import DropdownMenu from "./Dropdown";
import Chart from 'react-apexcharts';
import "../css/Apple.css"
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import queryString from "query-string";
import aapl from '../stock_json/aapl.json'



const aaplData = 'https://yahoo-finance-api.vercel.app/AAPL';
async function getData() {
    const response = await fetch(aaplData);
    return response.json();
}





const API_TOKEN = "c9mrn1qad3ie533htcn0";
const STOCK_SYMBOLS = ["AAPL"]
const INTERVAL_OPTIONS = [30, 60, 90, 120]
const API_URL = "https://finnhub.io/api/v1/stock/candle"
const RESOLUTION = "D"




function getUnixTime(date) {
    return date.getTime() / 1000 | 0;
}

const directionEmojis = {
    up: '🚀',
    down: '💩',
    '': '',
};


const chart = {
    options: {
        chart: {
            type: 'candlestick',
            height: 350
        },
        title: {
            text: 'Apple Chart',
            align: 'left'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    },
};

const round = (number) => {
    return number ? +(number.toFixed(2)) : null;
};

const datas = [{name: 'Page A', uv: 200, pv: 2400, amt: 2400}];

function Apple() {
    const [symbol, setSymbol] = useState(STOCK_SYMBOLS[0])
    const [data, setData] = useState(null);
    const [interval, setInterval] = useState(INTERVAL_OPTIONS[0]);

    const to = useMemo(() => {
        return getUnixTime(new Date());
    }, []);
    const from = useMemo(() => {
        let d = new Date();
        d.setDate(d.getDate() - interval);

        return getUnixTime(d);
    }, [interval])

    useEffect(() => {
        if (!from || !to || !symbol) {
            return;
        }

        const query = {
            token: API_TOKEN,
            resolution: RESOLUTION,
            from,
            to,
            symbol
        };

        fetch(`${API_URL}?${queryString.stringify(query)}`)
            .then(async data => setData(transformData(await data.json())))
            .catch(error => console.error(error))
    }, [from, to, symbol]);



    const handleChangeStock = event =>
        setSymbol(event.target.value);

    const handleChangeInterval = event =>
        setInterval(event.target.value);


    const [series, setSeries] = useState([{
        data: []
    }]);

    const [price, setPrice] = useState(-1);
    const [prevPrice, setPrevPrice] = useState(-1);
    const [priceTime, setPriceTime] = useState(null);

    function addPredictionData(data) {
        // console.log(aapl.t)
        // console.log(aapl.c)
        // data['pc'].push(2120);
        var arr = [20, 22, 33]
        data.pc = arr;
        console.log(data)
        for(let i = 0; i < 30; i++) {
            data.c.push(aapl.c[i]);
            data.t.push((new Date().setDate(new Date().getDate() + i)/1000))
        }


    }

    function transformData(data) {
        addPredictionData(data)
        // data.c.push(20,30,40);
        // data.t.push(new Date().getTime()/1000, new Date().setDate(new Date().getDate() + 1)/1000, new Date().setDate(new Date().getDate() + 2)/1000);
        // for(let i = data.c.length - 30; i < data.c.length; i++) {
        //     return data.c.map((item, i) => ({
        //         predictedClose: Number(data.c[i]).toFixed(2)
        //     }))
        // }
        return data.c.map((item, index) => ({
            close: Number(item).toFixed(2),
            open: Number(data.o[index]).toFixed(2),
            timestamp: new Date(data.t[index] * 1000).toLocaleDateString()
        }))
    }




    useEffect(() => {
        let timeoutId;
        async function getLatestPrice() {
            try {
                const data = await getData();
                console.log(data);
                const aapl = data.chart.result[0];
                setPrevPrice(price);
                setPrice(aapl.meta.regularMarketPrice.toFixed(2));
                setPriceTime(new Date(aapl.meta.regularMarketTime * 1000));
                const quote = aapl.indicators.quote[0];
                const prices = aapl.timestamp.map((timestamp, index) => ({
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
                ${price} {directionEmojis[direction]}
            </div>
            {/*<div className="price-time">*/}
            {/*    {priceTime && priceTime.toLocaleTimeString()}*/}
            {/*</div>*/}


            <div className="container">
                <div className="selector">
                    <label htmlFor="stock_select" className="label">
                        <strong>Stock Symbol: {Date.now()}</strong>
                    </label>
                    <select id="stock_select" onChange={handleChangeStock}>
                        {STOCK_SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="selector">
                    <label htmlFor="interval_select" className="label">
                        <strong>Time Interval: </strong>
                    </label>
                    <select onChange={handleChangeInterval}>
                        {INTERVAL_OPTIONS.map(s => <option key={s} value={s}>Past {s} days</option>)}
                    </select>
                </div>
            </div>


            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis type="number" allowDecimals={true}
                           allowDataOverflow={true} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="open" stroke="blue" dot={false} />
                    <Line type="monotone" dataKey="close" stroke="gray" dot={false} />
                    {/*<Line type="monotone" dataKey="predictedClose" stroke="red" dot={false} />*/}
                </LineChart>
            </ResponsiveContainer>

            {/*<Chart options={chart.options} series={series} type="candlestick" width="100%" height={450} />*/}
        </div>


            //
            // TODO: body of text explaining apple stock, project etc
            // TODO: Graph showing stock

            // TODO: Buy or sell indicator
            // TODO: Candle sticks for daily stock prices
            // TODO: Past 30, 60, 90, 120 days stock prices
            // TODO: Line chart with predictions (30 days)
            // TODO: Some other representation of physical numbers for predicted 30 day data (either chart or paragraph)
    );
}

export default Apple;