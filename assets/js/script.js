var APIKey = 'a9a3664e3b7b37a690bb362ee24e7e9f';

var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');
var displaySearch = document.getElementById('previous-search');
var singleDayDisplay = document.getElementById('single-day-display');

var city ;
var currentDay = dayjs().format("M/D/YYYY");

function fetchAndDisplayWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            singleDayDisplay.innerHTML = "";

            var cityDisplay = document.createElement('div');
            var cityName = document.createElement('h5');
            var currentTemp = document.createElement('p');
            var windSpeed = document.createElement('p');
            var humidity = document.createElement('p');

            cityName.textContent = city + " " + currentDay;
            currentTemp.textContent = "Current Temp: " + data.main.temp + "\u00B0F";
            windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
            humidity.textContent = "Humidity: " + data.main.humidity + " \%";

            cityDisplay.append(cityName, currentTemp, windSpeed, humidity);
            singleDayDisplay.append(cityDisplay);
        });
}

function fetchGeo(city) {
    city = searchInput.value;
    var queryURLGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    fetch(queryURLGeo)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log(lat, lon);
        });
}

searchButton.addEventListener('click', function() {
    city = searchInput.value;
    fetchAndDisplayWeather(city);
    fetchGeo(city);
    var searchedItems = document.createElement('button');
    searchedItems.textContent = city;
    searchInput.value = "";
    displaySearch.append(searchedItems);
    searchedItems.addEventListener('click', function() {
        fetchAndDisplayWeather(city);
    });
});

displaySearch.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        var clickedCity = event.target.textContent;
        fetchAndDisplayWeather(clickedCity);
    }
});

