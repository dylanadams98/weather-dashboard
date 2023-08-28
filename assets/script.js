const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
const MAX_DAILY_FORECAST = 5;

// create an array of searched locations

const recentLocations = [];

const getLocation = () => {

    const userLocation = locationInput.value;

    if (userLocation === '') {
        setLocationError.textContent = 'Please enter a location';
    } else {
        lookupLocation(userLocation);
    }
}

const clearError = () => {
    const errorDisplay = document.getElementById('error');
    errorDisplay.textContent = '';

    const setLocationError = (text) => {
        const errorDisplay = document.getElementById('error');
        errorDisplay.textContent = text;

        setTimeout(clearError, 3000);
    }
}


const lookupLocation = (search) => {

    // Lookup the location to get the Lat/Lon
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            // Pick the First location from the results
            //const location = data[0];
            var lat = data[0].lat;
            var lon = data[0].lon;

            const myData = {
                name: data[0].name,
                country: data[0].country,
                lat: data[0].lat,
                lon: data[0].lon
            }

            console.log(myData);

            // Get the Weather for the cached location
            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
            console.log(apiUrl);
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {

                    console.log(data);

                    // Display the Current Weather
                    displayCurrentWeather(data);

                    // Display the 5 Day Forecast
                    displayWeatherForecast(data);
                })

                displayWeather(myData);
        })
}

const displayCurrentWeather = (weatherData) => {
    const currentWeather = weatherData.current;

    document.getElementById('temp_value').textContent = `${currentWeather.temp}`;
    document.getElementById('wind_value').textContent = `${currentWeather.wind}`;
    document.getElementById('humidity_value').textContent = `${currentWeather.humidity}`;
    document.getElementById('uv_value').textContent = `${currentWeather.uv}`;
}

const displayWeatherForecast = (weatherData) => {

    const dailyData = weatherData.daily;

    document.getElementById('forecast').style.display = 'block';

    const forecastList = document.getElementById('forecast_days');
    forecastList.innerHTML = '';

for (let i = 0; i < MAX_DAILY_FORECAST; i++) {

    const dailyForecast = dailyData[i];
    const day = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    const temp = `${dailyForecast.temp.day}%`;
    const humidity = `${dailyForecast.humidity}%`;
    const wind = `${dailyForecast.wind_speed} MPH`;

    const newForecast = document.createElement('div');
    newForecast.classList.add('forecast-day');
    newForecast.innerHTML = `<div class=weather-info">
        <div class=day>
            <span>${day}</span>
         </div>
         
         <div class=temperature>
            <span>${temp}</span>
         </div>

         <div class=wind>
            <span>${wind}}</span>
         </div>

         <div class=humidity>
            <span>${humidity}}</span>
         </div>
         </div>`;
         forecastList.appendChild(newForecast);
    }
 }


 const getWeatherData = (lat, lon) => {

    var apiUrl = `${WEATHER_API_BASE_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
    console.log(apiUrl);
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            displayCurrentWeather(data);

            displayWeatherForecast(data);
    })
}

const displayWeather = (weatherData) => {
    document.getElementById('location-name').textContent = `${weatherData.name}, ${weatherData.country}`;

    getWeatherData(weatherData.lat, weatherData.lon);
}

const locationInput = document.getElementById('location');
const searchButton = document.getElementById('search');

searchButton.addEventListener('click', getLocation);


// Add an event handler for the search button

