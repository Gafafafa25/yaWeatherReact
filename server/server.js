import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool} = pg

const pool = new Pool({
    host: "localhost",
    user: "myuser",
    password: "mypassword",
    database: "YaWeather"
});

const app = express();
app.use(express.json());
app.use(cors());

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