

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
    const city = data.name;
    weatherDetails.innerHTML = `
        <div class="weather-info">
            <h3>Weather in ${city}</h3>
            <p>Temperature: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Condition: ${condition}</p>
            <button id="pinWeather" class="pin-btn">📌 Pin</button>
        </div>
    `;

    document.getElementById('pinWeather').addEventListener('click', () => {
        pinWeather(city, temp, humidity, condition);
    });
}

function displayErrorMessage(message) {
    const weatherDetails = document.querySelector('.weatherDetails');
    weatherDetails.innerHTML = `
        <div class="weather-info error">
            <p>${message}</p>
        </div>
    `;
}

function pinWeather(city, temp, humidity, condition) {
    const pinned = getPinnedWeather();
    const existing = pinned.find(p => p.city.toLowerCase() === city.toLowerCase());
    if (existing) {
        displayErrorMessage(`The city is already pinned.`);
        return;
    }
    pinned.push({ city, temp, humidity, condition });
    savePinnedWeather(pinned);
    displayPinnedWeather();
}

function getPinnedWeather() {
    return JSON.parse(localStorage.getItem('pinnedWeather')) || [];
}

function savePinnedWeather(pinned) {
    localStorage.setItem('pinnedWeather', JSON.stringify(pinned));
}

function displayPinnedWeather() {
    const pinned = getPinnedWeather();
    const tbody = document.getElementById('pinnedWeatherBody');
    const pinnedWeatherDiv = document.querySelector('.pinned-weather');
    tbody.innerHTML = '';
    pinned.forEach((weather, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${weather.city}</td>
            <td>${weather.temp}°C</td>
            <td>${weather.humidity}%</td>
            <td>${weather.condition}</td>
            <td><button class="remove-btn" data-index="${index}">❌</button></td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removePinnedWeather(index);
        });
    });

    if (pinned.length > 0) {
        pinnedWeatherDiv.style.display = 'block';
    } else {
        pinnedWeatherDiv.style.display = 'none';
    }
}

function removePinnedWeather(index) {
    const pinned = getPinnedWeather();
    pinned.splice(index, 1);
    savePinnedWeather(pinned);
    displayPinnedWeather();
}

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

    displayPinnedWeather();
}

initWeather();
