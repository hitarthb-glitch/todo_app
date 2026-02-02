

function initWeather() {
    const cityForm = document.getElementById("cityForm");
    const cityInput = document.getElementById("cityInput");

    if (cityForm && cityInput) {
        cityForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                getWeatherDataWithThen(city, 'fbcaa90586ab8edf625313e520dbe46a');
                cityInput.value = '';
            }
        });
    }
}

function getWeatherDataWithThen(city, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            const weatherDetails = document.querySelector('.weatherDetails');
            displayErrorMessage(`Failed to fetch weather data. Please check the city name and try again.`);
        });
}

function displayWeatherData(data) {
    const weatherDetails = document.querySelector('.weatherDetails');
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].description;
    weatherDetails.innerHTML = `
        <div class="weather-info">
            <h3>Weather in ${data.name}</h3>
            <p>Temperature: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Condition: ${condition}</p>
        </div>
    `;
}

function displayErrorMessage(message) {
    const weatherDetails = document.querySelector('.weatherDetails');
    weatherDetails.innerHTML = `
        <div class="weather-info error">
            <p>${message}</p>
        </div>
    `;
}

initWeather();
