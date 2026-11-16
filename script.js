const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");

searchButton.addEventListener("click", function() {

    const location = locationInput.value.trim();

    if (location === "") {
        message.textContent = "Please enter a location.";
    } else {
        message.textContent = `Location selected: ${location}`;
    }

});