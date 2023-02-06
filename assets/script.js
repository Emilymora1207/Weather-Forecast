var searchInput = document.querySelector('.search');
var searchBtn = document.querySelector('.searchBtn')
var searchHistoryEl = document.querySelector('.searchHistory');
var todayForm = document.querySelector('.today');
var fiveDayForm = document.querySelector('.fiveDay');


searchBtn.addEventListener('click', getSearchedLocation);

function getSearchedLocation() {
    var searchedLocation = searchInput.value;
    console.log(searchedLocation);
    // var cityState = searchedLocation.split(',');
    // console.log(cityState);
}

function GetWeatherForecast(event) {
    event.preventDefault()
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=Sacramento,CA,USA&limit={limit}&appid=e88cd06419645f7fd7b6ea89f17cda0c';
  
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
  
        });
      }
    });
  };

//   GetWeatherForecast()


//   {city name},{state code},{country code}

