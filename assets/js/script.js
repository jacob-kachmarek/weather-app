var APIKey = 'a9a3664e3b7b37a690bb362ee24e7e9f';
var city ;
var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
    city = searchInput.value;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });

})

