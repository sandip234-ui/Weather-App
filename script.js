document.addEventListener("DOMContentLoaded", () => {

    const cityInput = document.querySelector(".city-input");
    const searchBtn = document.querySelector(".search-btn");
    const forecastItemsContainer = document.querySelector(".forecast-item-container");

    const weatherInfoSection = document.querySelector(".weather-info");
    const notFoundSection = document.querySelector(".not-found");
    const searchCitySection = document.querySelector(".search-city");

    const countryTxt = document.querySelector(".country-text");
    const tempTxt = document.querySelector(".temp-text");
    const conditionTxt = document.querySelector(".condition-text");
    const humidityTxt = document.querySelector(".Humidity-value");
    const windSpeedTxt = document.querySelector(".wind-speed-value");
    const weatherIcon = document.querySelector(".weather-summary-img");
    const dateTxt = document.querySelector(".current-date-text");

    const apiKey = 'a08e788791ffe66540b1ca15b631cde9';

    searchBtn.addEventListener("click", () => {
        if (cityInput.value.trim() !== "") {
            updateWeatherinfo(cityInput.value);
            cityInput.value = "";
            cityInput.blur();
        }
    });

    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && cityInput.value.trim() !== "") {
            updateWeatherinfo(cityInput.value);
            cityInput.value = "";
            cityInput.blur();
        }
    });

    function getWeatherIcon(id) {
        if (id <= 232) {
            return "thunderstorm.svg";
        } else if (id <= 321) {
            return "drizzle.svg";
        } else if (id < 531) {
            return "rain.svg";
        } else if (id <= 622) {
            return "snow.svg";
        } else if (id <= 781) {
            return "atmosphere.svg";
        } else if (id === 800 || id === "800") {
            return "clear.svg";
        } else {
            return "clouds.svg";
        }
    }

    async function getFetchData(endpoint, cityName) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${cityName}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        return response.json();
    }

    function showDisplaySection(section) {
        [weatherInfoSection, notFoundSection, searchCitySection].forEach(section =>
            section.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    async function updateForecastInfo(cityName) {
        const forecastsData = await getFetchData('forecast', cityName);
        const forecastList = forecastsData.list;
        const forecastByDate = {};
        const today = new Date().toISOString().split('T')[0];

        for (const forecast of forecastList) {
            const [date, time] = forecast.dt_txt.split(' ');

            // Skip today's forecasts
            if (date === today) continue;

            // If this is the first forecast for the date, save it
            if (!forecastByDate[date]) {
                forecastByDate[date] = forecast;
                continue;
            }

            // Otherwise, replace it if this forecast is closer to 12:00
            const prevTimeHour = parseInt(forecastByDate[date].dt_txt.split(' ')[1].split(':')[0]);
            const currTimeHour = parseInt(time.split(':')[0]);

            if (Math.abs(currTimeHour - 12) < Math.abs(prevTimeHour - 12)) {
                forecastByDate[date] = forecast;
            }
        }

        // Clear old forecast items
        forecastItemsContainer.innerHTML = '';

        // Show forecast for next 5 days
        Object.values(forecastByDate).slice(0, 5).forEach(updateForecastItems);
    }

    function updateForecastItems(weatherData) {
        const {
            dt_txt: date,
            main: { temp },
            weather: [{ id }],
        } = weatherData;

        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
        });

        const forecastItem = `
        <div class="forecast-item h-[90%] w-[7rem] mt-[1rem] mr-2 ml-2 hover:bg-[rgba(173,225,231,0.596)] min-w-[80px] border bg-white/10 flex flex-col gap-[6px] p-[8px] items-center rounded-[12px] transition-[background] duration-300">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="./Public/assets/weather/${getWeatherIcon(id)}" alt="forecast image" class="forecast-item-img">
            <h5 class="font-semibold forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>`;

        forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
    }

    async function updateWeatherinfo(cityName) {
        const weatherData = await getFetchData('weather', cityName);
        if (weatherData.cod !== "200" && weatherData.cod !== 200) {
            showDisplaySection(notFoundSection);
            return;
        }

        const {
            name: country,
            main: { temp, humidity },
            weather: [{ id, main }],
            wind: { speed },
        } = weatherData;

        countryTxt.textContent = country;
        tempTxt.textContent = Math.round(temp) + " °C";
        conditionTxt.textContent = main;
        humidityTxt.textContent = humidity + " %";
        windSpeedTxt.textContent = speed + " m/s";
        weatherIcon.src = `./Public/assets/weather/${getWeatherIcon(id)}`;

        dateTxt.textContent = new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });

        await updateForecastInfo(cityName);
        showDisplaySection(weatherInfoSection);
    }

});