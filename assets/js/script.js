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
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            cityName.textContent = city + " " + currentDay;
            currentTemp.textContent = "Current Temp: " + data.main.temp + "\u00B0F";
            windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
            humidity.textContent = "Humidity: " + data.main.humidity + " \%";

            cityDisplay.append(cityName, currentTemp, windSpeed, humidity);
            singleDayDisplay.append(cityDisplay);
            console.log(data);

            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            fetch(forecastURL)
                .then(function(response) {
                    return response.json();
                })
                .then(function(forecastData) {
                    var groupedData = groupForecastByDate(forecastData.list);
                    console.log(groupedData);
                    var forecastContainer = document.getElementById('5-day-forecast');
                    forecastContainer.innerHTML = '';

                    for (var date in groupedData) {
                        var forecastGroup = groupedData[date];

                        var forecastDay = document.createElement('div');
                        var forecastDate = document.createElement('h7');
                        forecastDate.textContent = date;

                        var hottestPoint = forecastGroup[7];
                        var hottestTemp = hottestPoint.main.temp;

                        
                        var forecastItem = document.createElement('p');
                        forecastItem.textContent = hottestTemp + "\u00b0f";
                        forecastDay.appendChild(forecastItem);
                        
                        forecastContainer.appendChild(forecastDate);
                        forecastContainer.appendChild(forecastDay);
                    }
                })
            
        });
}

function groupForecastByDate(forecastList) {
    var groupedData = {};
  
    forecastList.forEach(function(forecast) {
      var date = forecast.dt_txt.split(" ")[0]; 
  
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
  
      groupedData[date].push(forecast);
    });
  
    return groupedData;
  }

searchButton.addEventListener('click', function() {
    city = searchInput.value;
    if (!searchInput.value) {
        return
    }
    fetchAndDisplayWeather(city);
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

