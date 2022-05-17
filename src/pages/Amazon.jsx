import React, {useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../css/Dropdown.css"
import DropdownMenu from "./Dropdown";
import Chart from 'react-apexcharts';
import "../css/Apple.css"
import {
    LineChart,
    BarChart,
    ScatterChart,
    Line,
    Scatter,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Bar
} from 'recharts';
import queryString from "query-string";
// import MaterialTable from "material-table";


import amzn from '../stock_json/amzn.json'

const amznData = 'https://yahoo-finance-api.vercel.app/AMZN';
async function getData() {
    const response = await fetch(amznData);
    return response.json();
}

const API_TOKEN = "c9mrn1qad3ie533htcn0";
const STOCK_SYMBOLS = ["AMZN"]
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
            height: 450
        },
        title: {
            text: 'Amazon Live Daily Candle Chart',
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
            datetimeUTC: false
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

function Amazon() {
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
    //
    function addPredictionData(data) {
        const predicted = [];
        const predTimestamps = [];
        // for(let i = 0; i < data.c.length; i++){
        //     predicted.push(data.c[i]);
        // }

        for(let i = 0; i < 30; i++) {
            predicted.push(amzn.c[i]);
            predTimestamps.push(amzn.t[i]);
        }
        data.pc = predicted;
        data.pt = predTimestamps;
        // for(let i = 0; i < 30; i++) {
        //     data.c.push(amzn.c[i]);
        //     data.t.push(amzn.t[i]);
        // }
    }

    function transformData(data) {
        addPredictionData(data)
        return data.c.map((item, index) => ({
            close: Number(item).toFixed(2),
            open: Number(data.o[index]).toFixed(2),
            predictions: Number(data.pc[index]).toFixed(2),
            predictTime: new Date(data.pt[index] * 1000).toLocaleDateString(), //            predictTime: new Date(data.pt[index] * 1000).toLocaleDateString(),
            timestamp: new Date(data.t[index] * 1000).toLocaleDateString(),
            volume: Number(data.v[index])
        }))
    }

    useEffect(() => {
        let timeoutId;
        async function getLatestPrice() {
            try {
                const data = await getData();
                console.log(data);
                const amzn = data.chart.result[0];
                setPrevPrice(price);
                setPrice(amzn.meta.regularMarketPrice.toFixed(2));
                setPriceTime(new Date(amzn.meta.regularMarketTime * 1000));
                const quote = amzn.indicators.quote[0];
                const prices = amzn.timestamp.map((timestamp, index) => ({
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
            <Chart options={chart.options} series={series} type="candlestick" width="100%" height={450} />

            <div className="container">
                <div className="selector">
                    <strong>Amazon Historical Data and Predictions</strong><br/>
                    <label htmlFor="stock_select" className="label">
                        <strong>Stock Symbol:</strong>
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
                    <XAxis dataKey="predictTime"/>
                    <YAxis type="number" allowDecimals={true}
                           allowDataOverflow={true} domain={[2000, 3440]}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" strokeWidth={1.4} dataKey="predictions" stroke="red" dot={false} />
                    {/*<Line type="monotone" dataKey="predictTime" strokeWidth={2} stroke="green" dot={false} />*/}
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp"/>
                    <YAxis type="number" allowDecimals={true}
                           allowDataOverflow={true} domain={[2000, 3440]}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" strokeWidth={1.4} dataKey="close" stroke="red" dot={false} />
                    <Line type="monotone" dataKey="open" strokeWidth={2} stroke="green" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 35,
                        left: 30,
                        bottom: 5,
                    }}
                    barSize={20}
                >
                    <XAxis dataKey="timestamp" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis tick={{ fontSize: 14, width: 250 }}/>
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="volume" fill="#8884d8" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        // TODO: body of text explaining apple stock, project etc
        // TODO: Some other representation of physical numbers for predicted 30 day data (either chart or paragraph)
    );
}

export default Amazon;