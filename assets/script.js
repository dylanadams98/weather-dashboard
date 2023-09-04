const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
const MAX_DAILY_FORECAST = 5;


// create an array of searched locations

const getLocation = () => {

    const userLocation = locationInput.value;

    saveToLocal();

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
            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
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

    document.getElementById('icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png"/>`;

    document.getElementById('temp_value').textContent = `${currentWeather.temp}°`;
    document.getElementById('wind_value').textContent = `${currentWeather.wind_speed} MPH`;
    document.getElementById('humidity_value').textContent = `${currentWeather.humidity} %`;
    document.getElementById('uv_value').textContent = `${currentWeather.uvi}`;
}


const displayWeatherForecast = (weatherData) => {

    const dailyData = weatherData.daily;

    document.getElementById('forecast').style.display = 'block';

    const forecastList = document.getElementById('forecast-days');
    forecastList.innerHTML = '';

    for (let i = 0; i < MAX_DAILY_FORECAST; i++) {

        const dailyForecast = dailyData[i];
        var icon = `<img src="https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png"/>`;
        const day = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const temp = `${dailyForecast.temp.day}°`;
        const humidity = `${dailyForecast.humidity}%`;
        const wind = `${dailyForecast.wind_speed} MPH`;
        const uv = `${dailyForecast.uvi}`;

        const newForecast = document.createElement('div');
        newForecast.classList.add('forecast-day');
        newForecast.innerHTML = `<div class=weather-info">
        <div class=day>
            <span>${day}</span>
         </div>

         <div class="icon">
             <span>${icon}</span>
             </div>
         
         <div class=temperature>
            <span>Temp: ${temp}</span>
         </div>

         <div class=wind>
            <span>Wind: ${wind}</span>
         </div>

         <div class=humidity>
            <span>Humidity: ${humidity}</span>
         </div>

         <div class=uv-index>
         <span>UV Index: ${uv}</span>
      </div>
         </div>`;
        forecastList.appendChild(newForecast);
    }
}


const getWeatherData = (lat, lon) => {

    var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
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

function saveToLocal() {

    forecast.style.display = 'block';

    var weatherHistory = JSON.parse(localStorage.getItem('location')) || [];

    var locationValue = document.getElementById('location').value;

    console.log(locationValue.value);

    weatherHistory.push(locationValue);

    // Challenging local storage functionality that is not currently fully working.

    localStorage.setItem('location', JSON.stringify(weatherHistory));

    var savedLocations = document.getElementById('saved-locations')

    var historyButton = document.createElement('button');
    historyButton.innerHtml = locationValue;
    savedLocations.appendChild(historyButton);

    var savedHistoryButtons = document.querySelectorAll(".saved-locations button");

    savedHistoryButtons.forEach(button => button.addEventListener('click', handleClick));

}

function handleClick(event) {

    var clickedHistoryButton = event.target;
    var buttonContent = clickedHistoryButton.innerText;

    console.log("History updated", buttonContent);

    event.preventDefault();
}



locationInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getLocation();
    }
});