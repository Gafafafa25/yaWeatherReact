import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool} = pg

const pool = new Pool({
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_DATABASE
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/getWeather", async (req, res) => {
    const {lat, lon} = req.body;
    const response = await fetch(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`,
        {headers: {'X-Yandex-Weather-Key':  process.env.APIKEY}})
    const data = await response.json()
    res.json(data)
})

app.post('/postCoords', async (req, res) => {
    const d = req.body;
    try {
        const result = await pool.query("INSERT INTO weather VALUES (DEFAULT, $1, $2, $3, $4)", [])
    } catch (err) {
        res.status(500).send('Database error');
    }
    res.send('ok')
})

app.post('/getCoords', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM weather')
        res.json(result.rows)
    } catch (err) {
        res.status(500).send('Database error');
    }
})


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});