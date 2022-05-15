// https://finnhub.io/dashboard

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
        const predicted = [];
        const predTimestamps = [];
        for(let i = 0; i < data.c.length - 1; i++){
            predicted.push(data.c[i]);
        }

        for(let i = 0; i < 30; i++) {
            if(data.t[i] === aapl.t[i]) {
                predicted.push(aapl.c[i]);
                i++;
            } else {
                predicted.push(aapl.c[i]);
                predTimestamps.push(aapl.t[i]);
            }
        }
        data.pc = predicted;
        data.pt = predTimestamps;
        console.log(data)
        for(let i = 0; i < 30; i++) {
            data.c.push(aapl.c[i]);
            data.t.push(data.pt[i]);
            // data.t.push((new Date().setDate(new Date().getDate() + i)/1000))
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
                    <XAxis dataKey="timestamp" />
                    {/*<XAxis dataKey="predictTime" />*/}
                    <YAxis type="number" allowDecimals={true}
                           allowDataOverflow={true} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" strokeWidth={1.4} dataKey="open" stroke="blue" dot={false} />
                    {/*<Line type="monotone" dataKey="close" stroke="green" dot={false} />*/}
                    <Line type="monotone" dataKey="predictions" stroke="red" dot={false} />
                    {/*<Line type="monotone" dataKey="volume" stroke="red" dot={false} />*/}
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    // width={500}
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

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    width={400}
                    height={400}
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,

                    }}
                >
                    {/*// TODO: Figure out why this shit ain't working cuhhhhh*/}
                    <CartesianGrid />
                    <XAxis type="number" dataKey="timestamp" />
                    <YAxis type="number" dataKey="close"/>
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="A school" fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>

            {/*<Chart options={chart.options} series={series} type="candlestick" width="100%" height={450} />*/}
        </div>


            //
            // TODO: body of text explaining apple stock, project etc

            // TODO: Buy or sell indicator
            // TODO: Candle sticks for daily stock prices
            // TODO: Fix date issue in graph (prediction should start on May 13 @ 154
            // TODO: Some other representation of physical numbers for predicted 30 day data (either chart or paragraph)
    );
}

export default Apple;