import {useEffect, useState} from 'react'
import './App.css'
import Spinner from '../components/Spinner.jsx';
import Spinner2 from '../components/Spinner2.jsx';
import {CiSettings} from "react-icons/ci";
import {IoMdClose} from "react-icons/io";
import {IoMdCheckmark} from "react-icons/io";

function App() {
    const [weatherData, setWeatherData] = useState({})
    const [coords, setCoords] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    // const [weatherCache, setWeatherCache] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const [spinnerType, setSpinnerType] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState("type1")

    const getWeatherFromAPI = async () => {
        setErrorMessage("")
        // setSpinnerType(1)
        const coordsRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/
        if (!coords.trim().match(coordsRegex) ) {
            setErrorMessage("Invalid coords format")
            return
        }

        const [lat, lon] = coords.split(", ")
        console.log(lat, " lat")
        console.log(lon, " lon")
        const key = `${lat}, ${lon}`

        const responseDataDB = await fetch('/getCacheData', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentLogin: "abc"
            })
        })
        console.log(responseDataDB)
        let res = await responseDataDB.json();
        console.log(res)

        for(const row of res) {
            console.log(row.lat_lon, key)
            if (row.lat_lon === key) {
                const weatherInfo = {
                    temperature: row.temperature,
                    feels_like: row.feels_like,
                    wind_direction: row.wind_direction,
                }
                setWeatherData(weatherInfo)
                setIsLoading(false)
                console.log("data from cache")
                return
            }
        }
        console.log("after for")
        // if (weatherCache[key]) {
            // setWeatherData(weatherCache[key])
            // console.log("data from cache")
            // return
        // }
        setIsLoading(true)
        // const response = await fetch(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`,
        //     {headers: {'X-Yandex-Weather-Key': 'APIKEY'}})
        // const data = await response.json()
        //todo: fetch /postCoords
        // const responsePostCoords = await fetch('/updateCacheData', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         temperature: "abc"
        //     })
        // })
        // console.log(responseDataDB)
        // let res = await responseDataDB.json();
        // console.log(res)

        const weatherInfo = {
            temperature: data.fact.temp,
            feels_like: data.fact.feels_like,
            wind_direction: data.fact.wind_dir
        }
        setWeatherData(weatherInfo)
        //todo: update db with data

        // setWeatherCache(prevWeatherCache => ({...prevWeatherCache, [key]: weatherInfo}))
        console.log("data from API")
        setIsLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        getWeatherFromAPI()
    }

    return (
        <>
            <h1>Weather</h1>
            <div>
                <button onClick={() => setIsOpen(true)}>
                    <CiSettings size={30}/>
                </button>
            </div>
            {isOpen && (
                <div className="popup">
                    <form>
                        <div>
                            <input type="radio" id="type1" value="type1" name="radioBtn"
                                   checked={selectedOption === "type1"} onChange={(e) => {
                                setSelectedOption(e.target.value);
                                setSpinnerType(1);
                                setIsOpen(false);
                            }}
                            />
                            <label htmlFor="type1">type1</label>
                        </div>
                        <div>
                            <input type="radio" id="type2" value="type2" name="radioBtn"
                                   checked={selectedOption === "type2"} onChange={(e) => {
                                setSelectedOption(e.target.value);
                                setSpinnerType(2);
                                setIsOpen(false);
                            }}
                            />
                            <label htmlFor="type2">type2</label>
                        </div>
                    </form>
                    {/*<button type="button" onClick={() => setIsOpen(false)}>ok</button>*/}

                </div>
            )}
            {/*<form action={addCoords} method={postMessage()} onSubmit={handleSubmit}>*/}
            <form onSubmit={handleSubmit}>
                <label htmlFor="">55.677443, 37.892383</label>
                <input type="text" value={coords} onChange={(e) => setCoords(e.target.value)}/>
                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>
            <div>
                {isLoading && spinnerType === 1 && (
                    <Spinner/>
                )}
                {isLoading && spinnerType === 2 && (
                    <Spinner2/>
                )}
            </div>

            {weatherData && (
                <div>
                    <h2>Result</h2>
                    <div>
                        <span>temperature: </span>{weatherData.temperature}
                        <br/>
                        <span>feels like: </span>{weatherData.feels_like}
                        <br/>
                        <span>wind direction: </span>{weatherData.wind_direction}
                    </div>
                </div>
            )}
        </>
    )
}

export default App
