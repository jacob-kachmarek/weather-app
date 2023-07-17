document.addEventListener('DOMContentLoaded', function () {
  var APIKey = 'a9a3664e3b7b37a690bb362ee24e7e9f';

  var searchInput = document.getElementById('search-input');
  var searchButton = document.getElementById('search-button');
  var displaySearch = document.getElementById('previous-search');
  var singleDayDisplay = document.getElementById('single-day-display');

  var city;
  var currentDay = dayjs().format("M/D/YYYY");
  // Function for fetching weather data for the given city
  // and displaying it on the page
  function fetchAndDisplayWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        singleDayDisplay.innerHTML = "";

        var cityDisplay = document.createElement('div');
        var cityName = document.createElement('h5');
        var currentTemp = document.createElement('p');
        var windSpeed = document.createElement('p');
        var humidity = document.createElement('p');
        var emojiEl = document.createElement('P');
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        cityName.textContent = city + " " + currentDay;
        currentTemp.textContent = "Current Temp: " + data.main.temp + "\u00B0F";
        windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
        humidity.textContent = "Humidity: " + data.main.humidity + " \%";
        if (data.weather[0].main === "Clear") {
          emojiEl.textContent = '☀️';
        } else {
          emojiEl.textContent = '☁️';
        }

        cityDisplay.append(cityName, emojiEl, currentTemp, windSpeed, humidity);
        singleDayDisplay.append(cityDisplay);

        var singleDayData = {
          cityName: city + " " + currentDay,
          currentTemp: "Current Temp: " + data.main.temp + "\u00B0F",
          windSpeed: "Wind Speed: " + data.wind.speed + " MPH",
          humidity: "Humidity: " + data.main.humidity + " \%"
        };
        console.log(data);
        localStorage.setItem('singleDayData', JSON.stringify(singleDayData));

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
        fetch(forecastURL)
          .then(function (response) {
            return response.json();
          })
          .then(function (forecastData) {
            var groupedData = groupForecastByDate(forecastData.list);
            var forecastContainer = document.getElementById('five-day-forecast');
            forecastContainer.innerHTML = '';
            var forecastData = [];
            Object.keys(groupedData).slice(0, 5).forEach(function (date) {
              var forecastGroup = groupedData[date];
              var hottestTemp = -Infinity;
              var hottestPoint;

              forecastGroup.forEach(function (forecastPoint) {
                if (forecastPoint.main && forecastPoint.main.temp && forecastPoint.wind && forecastPoint.wind.speed) {
                  var temperature = forecastPoint.main.temp;
                  if (temperature > hottestTemp) {
                    hottestTemp = temperature;
                    hottestPoint = forecastPoint;
                  }
                }
              });

              if (hottestPoint) {
                var windSpeed = hottestPoint.wind.speed;
                var humidity = hottestPoint.main.humidity;

                var forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                var forecastDate = document.createElement('p');
                var forecastTemp = document.createElement('p');
                var forecastWind = document.createElement('p');
                var forecastHumidity = document.createElement('p');
                var emojiEl = document.createElement('P');

                forecastDate.textContent = date;
                forecastTemp.textContent = "Temp: " + hottestTemp + "\u00b0f";
                forecastWind.textContent = "Wind Speed: " + windSpeed;
                forecastHumidity.textContent = "Humidity: " + humidity + "\%";
                if (data.weather[0].main === "Clear") {
                  emojiEl.textContent = '☀️';
                } else {
                  emojiEl.textContent = '☁️';
                }

                forecastDay.append(forecastDate, emojiEl, forecastTemp, forecastWind, forecastHumidity);
                forecastContainer.appendChild(forecastDay);
                console.log("five-day", data)

                var forecastItem = {
                  date: date,
                  temperature: "Temp: " + hottestTemp + "\u00b0f",
                  humidity: "Humidity: " + humidity + "\%",
                };
                forecastData.push(forecastItem);
              }
            });
            localStorage.setItem('forecastData', JSON.stringify(forecastData));
          });
      });
  }
  // Function for grouping forecast data by date
  function groupForecastByDate(forecastList) {
    var groupedData = {};

    forecastList.forEach(function (forecast) {
      var date = forecast.dt_txt.split(" ")[0];

      if (!groupedData[date]) {
        groupedData[date] = [];
      }

      groupedData[date].push(forecast);
    });

    return groupedData;
  }
  // Function for displaying previously saved weather and forecast data
  function displaySavedData() {
    var savedSingleDayData = localStorage.getItem('singleDayData');
    if (savedSingleDayData) {
      var singleDayData = JSON.parse(savedSingleDayData);

      var cityDisplay = document.createElement('div');
      var cityName = document.createElement('h5');
      var currentTemp = document.createElement('p');
      var windSpeed = document.createElement('p');
      var humidity = document.createElement('p');

      cityName.textContent = singleDayData.cityName;
      currentTemp.textContent = singleDayData.currentTemp;
      windSpeed.textContent = singleDayData.windSpeed;
      humidity.textContent = singleDayData.humidity;

      cityDisplay.append(cityName, currentTemp, windSpeed, humidity);
      singleDayDisplay.append(cityDisplay);
    }

    var savedForecastData = localStorage.getItem('forecastData');
    if (savedForecastData) {
      var forecastData = JSON.parse(savedForecastData);
      var forecastContainer = document.getElementById('five-day-forecast');
      forecastContainer.innerHTML = '';

      forecastData.forEach(function (forecastItem) {
        var forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.style.border = '1px solid black';

        var forecastDate = document.createElement('p');
        forecastDate.textContent = forecastItem.date;

        var forecastTemp = document.createElement('p');
        forecastTemp.textContent = forecastItem.temperature;

        var forecastWind = document.createElement('p');
        forecastWind.textContent = forecastItem.windSpeed;

        var forecastHumidity = document.createElement('p');
        forecastHumidity.textContent = forecastItem.humidity;

        forecastDay.append(forecastDate, forecastTemp, forecastWind, forecastHumidity);
        forecastContainer.appendChild(forecastDay);


      });
    }
    var savedButtons = localStorage.getItem('buttons');
    if (savedButtons) {
      displaySearch.innerHTML = savedButtons;
      addEventListenersToButtons();
    }

  }
  // Function for adding event listeners to the search history buttons
  function addEventListenersToButtons() {
    var buttons = displaySearch.querySelectorAll('button');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var clickedCity = button.textContent;
        fetchAndDisplayWeather(clickedCity);
      });
    });
  }

  // Event listener for the search button click
  searchButton.addEventListener('click', function () {
    city = searchInput.value;
    if (!searchInput.value) {
      return;
    }
    fetchAndDisplayWeather(city);
    var searchedItems = document.createElement('button');
    searchedItems.textContent = city;
    searchInput.value = "";
    displaySearch.append(searchedItems);
    searchedItems.addEventListener('click', function () {
      fetchAndDisplayWeather(city);
    });
    localStorage.setItem("buttons", (displaySearch.innerHTML));
  });

  // Event listener for the previous search history button click
  displaySearch.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var clickedCity = event.target.textContent;
      fetchAndDisplayWeather(clickedCity);
    }
  });
  // Function call to display previously saved weather and forecast data
  displaySavedData();
});