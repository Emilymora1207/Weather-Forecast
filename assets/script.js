var searchInput = document.querySelector('.search');
var searchBtn = document.querySelector('.searchBtn')
var searchHistoryEl = document.querySelector('#searchHistory');
var todayForm = document.querySelector('.today');
var ForecastList = document.querySelector('.forecast');

var today = dayjs();
var searchHistoryList = [];


searchBtn.addEventListener('click', getSearchedLocation);

function getSearchedLocation(event) {
    event.preventDefault();
    var searchedLocation = searchInput.value || event.target.className;
    // console.log(searchedLocation);
    var locationNoSpace = searchedLocation.replace(' ', '');
    console.log(locationNoSpace);
    GetForecastLocation(locationNoSpace);
    if(searchHistoryEl === null){
      searchHistoryList = [searchedLocation];
    } else if (!searchHistoryList.includes(searchedLocation)) {

      searchHistoryList.unshift(searchedLocation);
      localStorage.setItem("searchHistoryList", JSON.stringify(searchHistoryList));
      storeSearchHistory();
    }
    searchInput.value = "";

    console.log(event);
}


function GetForecastLocation(location) {
  console.log(location)
    var locationUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=6&appid=e88cd06419645f7fd7b6ea89f17cda0c';
  
    fetch(locationUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          var locationLat = data[0].lat;
          var locationLon = data[0].lon;
          // console.log(locationLat);
          // console.log(locationLon);
            GetWeatherForecast(locationLat, locationLon);
        });
      }
    });
  };


function GetWeatherForecast(lat, lon) {
    var latLonForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&cnt=6&units=imperial&appid=e88cd06419645f7fd7b6ea89f17cda0c';
    fetch(latLonForecastUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
            displayForecast(data);
        });
      }
    });
  };

// GetWeatherForecast();

function displayForecast(data){
    var hidden = document.querySelector('.hidden');
    hidden.style.display= 'initial';
    todayForm.innerHTML = "";
    ForecastList.innerHTML = "";
    var todayDate = today.format('MM/DD/YYYY');
    var todayLocationDate = document.createElement('h2');
    todayForm.appendChild(todayLocationDate);
    todayLocationDate.textContent= (data.city.name + " " + todayDate);
    var todayIcon = document.createElement('img');
    todayForm.appendChild(todayIcon);
    var iconurl = "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png";
    todayIcon.setAttribute('src', iconurl);
    var todayWeatherList = document.createElement('ul');
    todayForm.appendChild(todayWeatherList);
    var todayTempEl = document.createElement('li');
    todayWeatherList.appendChild(todayTempEl);
    todayTempEl.textContent = ('temp: ' + data.list[0].main.temp + "\xB0F");
    var todayWindEl = document.createElement('li');
    todayWeatherList.appendChild(todayWindEl);
    todayWindEl.textContent = ("Wind: " + data.list[0].wind.speed + ' MPH');
    var todayHumidity = document.createElement('li');
    todayWeatherList.appendChild(todayHumidity);
    todayHumidity.textContent = ('Humidity: ' + data.list[0].main.humidity + ' %');

    for (var i=1; i < 6; i++) {
        var setDate = dayjs().add(i, 'day');
        var dateFormat = setDate.format('MM/DD/YYYY');
        var fiveDayForm = document.createElement('form');
        fiveDayForm.setAttribute('class', "day" + i);
        ForecastList.appendChild(fiveDayForm);
        var forecastDate = document.createElement('h3');
        fiveDayForm.appendChild(forecastDate);
        forecastDate.textContent = dateFormat;
        var forecastIcon = document.createElement('img');
        fiveDayForm.appendChild(forecastIcon);
        var fiveIconUrl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
        forecastIcon.setAttribute('src', fiveIconUrl);
        var forecastTemp = document.createElement('p');
        fiveDayForm.appendChild(forecastTemp);
        forecastTemp.textContent = ('temp: ' + data.list[i].main.temp + "\xB0F");
        var forecastWind = document.createElement('p');
        fiveDayForm.appendChild(forecastWind);
        forecastWind.textContent = ("Wind: " + data.list[i].wind.speed + ' MPH');
        var forecastHumidity = document.createElement('p');
        fiveDayForm.appendChild(forecastHumidity);
        forecastHumidity.textContent = ('Humidity: ' + data.list[i].main.humidity + ' %');
    }
};

function storeSearchHistory(){


  const getSearchHistory = JSON.parse(localStorage.getItem("searchHistoryList"));
  searchHistoryList = getSearchHistory;
  console.log(getSearchHistory);
  if (getSearchHistory !== null) {

    searchHistoryEl.innerHTML = '';
    for(i=0; i<getSearchHistory.length; i++) {
      var historyBtn = document.createElement('button');
      searchHistoryEl.appendChild(historyBtn);
      historyBtn.setAttribute('class', getSearchHistory[i]);
      historyBtn.textContent = getSearchHistory[i];
  }
}
}
//   GetWeatherForecast()
searchHistoryEl.addEventListener('click', getSearchedLocation)

storeSearchHistory();




