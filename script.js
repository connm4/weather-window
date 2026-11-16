const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");
const weatherSection = document.getElementById("weather-section");

// Retrieve weather information for a searched location
async function getWeather(locationName) {

    message.textContent = `Searching for ${locationName}...`;
    weatherSection.innerHTML = "";

    try {

        // STEP 1: Search for the location using the Geocoding API

        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=5&language=en&format=json`;

        const geocodingResponse = await fetch(geocodingUrl);

        if (!geocodingResponse.ok) {
            throw new Error(`Geocoding HTTP error: ${geocodingResponse.status}`);
        }

        const geocodingData = await geocodingResponse.json();

        // Check whether any matching locations were found

        if (!geocodingData.results || geocodingData.results.length === 0) {

            message.textContent = `No location found for "${locationName}". Try adding a country or region.`;
            return;

        }

        // Use the first matching location

        const place = geocodingData.results[0];

        const latitude = place.latitude;
        const longitude = place.longitude;

        const placeName = place.country
            ? `${place.name}, ${place.country}`
            : place.name;

        message.textContent = `Found ${placeName}. Retrieving weather...`;

        // STEP 2: Retrieve weather using the coordinates

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&hourly=temperature_2m,precipitation_probability,wind_speed_10m&forecast_days=2&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error(`Weather HTTP error: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();

        // STEP 3: Extract the weather information

        const current = weatherData.current;
        const units = weatherData.current_units;
        const hourly = weatherData.hourly;
        const hourlyUnits = weatherData.hourly_units;

        console.log(weatherData);

        // Find the current hour in the hourly forecast

        const currentHour = current.time.slice(0, 13);

        let startIndex = hourly.time.findIndex(time => time.slice(0, 13) >= currentHour);

        // If the current hour cannot be found, start at the beginning
        if (startIndex === -1) {
            startIndex = 0;
        }

        // Create HTML for the next 12 hours

        const forecastHtml = hourly.time
            .slice(startIndex, startIndex + 12)
            .map((time, offset) => {

                const index = startIndex + offset;

                const displayTime = time.split("T")[1];

                return `
                    <div class="forecast-card">

                        <h3>${displayTime}</h3>

                        <p class="forecast-temperature">
                            ${hourly.temperature_2m[index]} ${hourlyUnits.temperature_2m}
                        </p>

                        <p>
                            Rain: ${hourly.precipitation_probability[index]}${hourlyUnits.precipitation_probability}
                        </p>

                        <p>
                            Wind: ${hourly.wind_speed_10m[index]} ${hourlyUnits.wind_speed_10m}
                        </p>

                    </div>
                `;

            })
            .join("");

        
        // Extract the next 12 hours into individual forecast objects

        const upcomingForecast = hourly.time
            .slice(startIndex, startIndex + 12)
            .map((time, offset) => {

                const index = startIndex + offset;

                return {
                    time: time.slice(11, 16),
                    temperature: hourly.temperature_2m[index],
                    rainProbability: hourly.precipitation_probability[index],
                    windSpeed: hourly.wind_speed_10m[index]
                };

            });

        // Find hours that meet our walking criteria

        const suitableHours = upcomingForecast.filter(hour => {

            return (
                Number.isFinite(hour.temperature) &&
                Number.isFinite(hour.rainProbability) &&
                Number.isFinite(hour.windSpeed) &&
                hour.rainProbability <= 30 &&
                hour.windSpeed <= 25 &&
                hour.temperature >= 5 &&
                hour.temperature <= 25
            );
        });

        // Sort suitable hours by rain probability,
        // using wind speed as a tie-breaker

        suitableHours.sort((a, b) => {

            if (a.rainProbability !== b.rainProbability) {
                return a.rainProbability - b.rainProbability;
            }

            return a.windSpeed - b.windSpeed;

        });

        // Select the best available hour

        const recommendedHour = suitableHours[0];

        // Create the walking recommendation message

        let recommendationHtml;

        if (recommendedHour) {

            recommendationHtml = `
                <div class="recommendation-card">

                    <h3>Recommended time for a walk</h3>

                    <h2>${recommendedHour.time}</h2>

                    <p>
                        This hour has the lowest rain probability
                        among the hours that meet our criteria.
                    </p>

                    <p>
                        Temperature: ${recommendedHour.temperature}°C
                    </p>

                    <p>
                        Rain probability: ${recommendedHour.rainProbability}%
                    </p>

                    <p>
                        Wind speed: ${recommendedHour.windSpeed} km/h
                    </p>

                </div>
            `;

        } else {

            recommendationHtml = `
                <div class="recommendation-card no-recommendation">

                    <h3>No suitable walking time found</h3>

                    <p>
                        None of the next 12 hours meet all
                        of our selected weather criteria.
                    </p>

                    <p>
                        Consider checking the forecast again later.
                    </p>

                </div>
            `;

        }

        // STEP 4: Display the information
        
        weatherSection.innerHTML = `
            <h2>Weather in ${placeName}</h2>

            <h3>Current Conditions</h3>

            <p>Temperature: ${current.temperature_2m} ${units.temperature_2m}</p>

            <p>Feels like: ${current.apparent_temperature} ${units.apparent_temperature}</p>

            <p>Humidity: ${current.relative_humidity_2m}${units.relative_humidity_2m}</p>

            <p>Wind speed: ${current.wind_speed_10m} ${units.wind_speed_10m}</p>

            <p>Precipitation: ${current.precipitation} ${units.precipitation}</p>

            <h3>Walking Recommendation</h3>

            ${recommendationHtml}

            <h3>Hourly Forecast – Next 12 Hours</h3>

            <div class="forecast-grid">
                ${forecastHtml}
            </div>

            <p class="weather-attribution">
                Weather data by
                <a href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer">Open-Meteo</a>
            </p>
        `;

        message.textContent = "Weather information loaded successfully.";

    } catch (error) {

        console.error("Error retrieving weather:", error);

        message.textContent = "Unable to retrieve weather information. Please try again.";

    }
}

// Respond to the Search button

searchButton.addEventListener("click", function() {

    const location = locationInput.value.trim();

    if (location === "") {

        message.textContent = "Please enter a location.";

    } else if (location.length < 2) {

        message.textContent = "Please enter at least two characters.";

    } else {

        getWeather(location);

    }

});
