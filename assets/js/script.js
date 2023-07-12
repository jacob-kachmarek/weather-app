var APIKey = 'a9a3664e3b7b37a690bb362ee24e7e9f';

var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');
var displaySearch = document.getElementById('previous-search');
var singleDayDisplay = document.getElementById('single-day-display');

var city ;

searchButton.addEventListener('click', function() {
    city = searchInput.value;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

    fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    singleDayDisplay.innerHTML = "";
    
    var searchedItems = document.createElement('button');
    var cityDisplay = document.createElement('div');
    var cityName = document.createElement('h5');
    var currentTemp = document.createElement('p');
    var minTemp = document.createElement('p');
    var maxTemp = document.createElement('p');

    searchedItems.textContent = city;
    cityName.textContent = city;
    currentTemp.textContent = "Current Temp: " + data.main.temp + "\u00B0F";
    minTemp.textContent = "Min Temp: " + data.main.temp_min + "\u00B0F";
    maxTemp.textContent = "Max Temp: " + data.main.temp_max + "\u00B0F";

    displaySearch.append(searchedItems);
    cityDisplay.append(cityName, currentTemp, minTemp, maxTemp);
    singleDayDisplay.append(cityDisplay);



    console.log(data);
  });

})

