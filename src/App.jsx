import {useEffect, useState} from 'react'
import './App.css'
import Spinner from '../components/Spinner.jsx';
import Spinner2 from '../components/Spinner2.jsx';
import {CiSettings} from "react-icons/ci";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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
        if (!coords.trim().match(coordsRegex)) {
            setErrorMessage("Invalid coords format")
            return
        }

        const [lat, lon] = coords.split(", ")
        console.log(lat, " lat")
        console.log(lon, " lon")
        const key = `${lat}, ${lon}`

        // const responseDataDB = await fetch('/getCacheData', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        // console.log(responseDataDB)
        // let res = await responseDataDB.json();
        // console.log(res)

        const responseDataDBByDestination = await fetch('/getCacheDataByDestination', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lat_lon: key
            })
        })
        console.log(responseDataDBByDestination)
        let resultDataDBByDestination = await responseDataDBByDestination.json();
        console.log(resultDataDBByDestination)

        if (resultDataDBByDestination.length === 1) {
            setIsLoading(true)
            const weatherInfo = {
                temperature: resultDataDBByDestination[0].temperature,
                feels_like: resultDataDBByDestination[0].feels_like,
                wind_direction: resultDataDBByDestination[0].wind_direction
            }
            setWeatherData(weatherInfo)
            // setIsLoading(false)
            setTimeout(() => setIsLoading(false), 400);
            console.log("data from cache")
            return
        }

        console.log("after if")

        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 400);


        const response = await fetch(`/getWeather`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon
            })
        })
        const data = await response.json()

        const weatherInfo = {
            temperature: data.fact.temp,
            feels_like: data.fact.feels_like,
            wind_direction: data.fact.wind_dir
        }
        setWeatherData(weatherInfo)
        setIsLoading(false)
        setSpinnerType(2)
        setIsLoading(true)
        //update db with data
        const responseUpdateCacheData = await fetch('/updateCacheData', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lat_lon: coords,
                temperature: weatherInfo.temperature,
                feels_like: weatherInfo.feels_like,
                wind_direction: weatherInfo.wind_direction
            })
        })
        console.log(responseUpdateCacheData)


        // setWeatherCache(prevWeatherCache => ({...prevWeatherCache, [key]: weatherInfo}))
        console.log("data from API")
        setSpinnerType(1)
        // setIsLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        getWeatherFromAPI()
    }

    return (
        <>
            <h1>Weather</h1>


            <Popup triger={<button><CiSettings size={30}/></button>} position="right center">
                setIsOpen(true)
                {isOpen && (
                    <div>
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
            </Popup>
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
