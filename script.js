
const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");
const weatherSection = document.getElementById("weather-section");

// Example coordinates for London
const latitude = 51.5072;
const longitude = -0.1276;

// Function to retrieve weather information
async function getWeather() {

    message.textContent = "Loading weather information...";
    weatherSection.innerHTML = "";

    // Construct the API URL
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&forecast_days=1&timezone=auto`;

    try {

        // Send a request to the API
        const response = await fetch(weatherUrl);

        // Check whether the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert the response into JSON
        const data = await response.json();

        // Extract the current weather information
        const current = data.current;
        const units = data.current_units;

        console.log(data);

        // Display the weather information
        weatherSection.innerHTML = `
            <h2>Weather in London</h2>

            <p>Temperature: ${current.temperature_2m} ${units.temperature_2m}</p>

            <p>Feels like: ${current.apparent_temperature} ${units.apparent_temperature}</p>

            <p>Humidity: ${current.relative_humidity_2m}${units.relative_humidity_2m}</p>

            <p>Wind speed: ${current.wind_speed_10m} ${units.wind_speed_10m}</p>

            <p>Precipitation: ${current.precipitation} ${units.precipitation}</p>
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

    } else if (location.toLowerCase() !== "london") {

        message.textContent = "For now, please enter London. Other locations are coming soon.";

    } else {

        getWeather();

    }

});
