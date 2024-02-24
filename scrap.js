import axios from 'axios';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// function getOrderBookBySymbol() {

//     const url = "https://api.binance.com/api/v3/depth?symbol=SOLUSDT&limit=1000";
//     axios.get(url).then(async function (response) {
//         console.log(response.data);    
//     })
// }

// async function getAllPair() {
//     console.log("function called");
//     const url = "https://api.binance.com/sapi/v1/margin/allPairs";

//     axios.get(url, {
//         headers: {
//             Accept: "application/json",
//             "X-MBX-APIKEY": "9WTqWeM9FW1g9aOLRlMfrtEMEqczdec1mZhP8tosDQ33WG3s7JWYuN3pbb6fcpgw",
//             "SecretKey": "NJHtidzlyIMAISdTctI6r6b6jaZzMPvkz603WuYyVnm2pIQj1l16JeZYscj04foD",
//         }
//     }).then(async function (response) {
//         let data = []
//         data = response.data;
//         return data;
//     })
// }


const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/depth/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const url = `${process.env.API_URL_DEPTH}?symbol=${symbol}&limit=1000`;
    axios.get(url).then(async function (response) {
        res.send(response.data);
    });
})

app.get('/allpair', (req, res) => {
    const url = `${process.env.API_URL_ALLPAIR}`;
    axios.get(url, {
        headers: {
            Accept: "application/json",
            "X-MBX-APIKEY": `${process.env.API_X_MBX_APIKEY}`,
            "SecretKey": `${process.env.API_SECRET_KEY}`,
        }
    }).then(async function (response) {
        res.send(response.data);
    })
})

app.listen(3001, function () {
    console.log(`Server running on port 3001`)
});