import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool} = pg

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/getWeather", async (req, res) => {
    const {lat, lon} = req.body;
    const response = await fetch(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`,
        {headers: {'X-Yandex-Weather-Key': process.env.APIKEY}})
    const data = await response.json()
    res.json(data)
})

app.post('/updateCacheData', async (req, res) => {
    const d = req.body;
    console.log("json data ", d)
    try {
        const result = await pool.query(
            "INSERT INTO weather \
             VALUES (DEFAULT, $1, $2, $3, $4, $5) \
             ON CONFLICT (lat_lon)\
             DO UPDATE SET \
                    temperature = EXCLUDED.temperature, \
                    time = EXCLUDED.time, \
                    feels.like = EXCLUDED.feels.like, \
                    wind_direction = EXCLUDED.wind_direction",
            [d.lat_lon, d.temperature, d.feels_like, d.wind_direction, Math.floor(Date.now() / 1000)])
        console.log("res SQL INSERT ", result)
    } catch (err) {
        res.status(500).send('Database error' + err);
    }
    res.send('ok')
})

app.post('/getCacheData', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM weather')
        res.json(result.rows)
    } catch (err) {
        res.status(500).send('Database error' + err);
    }
})

app.post('/getCacheDataByDestination', async (req, res) => {
    const d = req.body;
    try {
        const result = await pool.query('SELECT * FROM weather WHERE lat_lon = ($1)', [d.lat_lon])
        console.log("RES API ", result.rows)
        res.json(result.rows)
    } catch (err) {
        res.status(500).send('Database error' + err);
    }
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});