//getting elements from the HTML page
var searchInput = document.querySelector('.search');
var searchBtn = document.querySelector('.searchBtn')
var searchHistoryEl = document.querySelector('#searchHistory');
var todayForm = document.querySelector('.today');
var ForecastList = document.querySelector('.forecast');
var bodyEl = document.querySelector('.body');

//to display the dates for the forecast
var today = dayjs();
var searchHistoryList = [];

//starts the functions when the searched button was pressed 
searchBtn.addEventListener('click', getSearchedLocation);
//starts the functions when a button in the search history was pressed 
searchHistoryEl.addEventListener('click', getSearchedLocation)

function getSearchedLocation(event) {
    event.preventDefault();
    //uses both the input from the search and the search history bittons
    var searchedLocation = searchInput.value || event.target.className;
    var locationNoSpace = searchedLocation.replace(' ', '');
    console.log(locationNoSpace);
    GetForecastLocation(locationNoSpace);
    //creates the buttons to click on in the search history 
    if(searchHistoryList === null){
      searchHistoryList = [searchedLocation];
    } else if (!searchHistoryList.includes(searchedLocation)) {
      searchHistoryList.unshift(searchedLocation);
      //puts the search history list into local storage
      localStorage.setItem("searchHistoryList", JSON.stringify(searchHistoryList));
      displaySearchHistory();
    }
    searchInput.value = "";

    console.log(event);
}

//takes the searched location and turned it into lon and lat for api search 
function GetForecastLocation(location) {
  console.log(location)
    var locationUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=6&appid=e88cd06419645f7fd7b6ea89f17cda0c';
  
    fetch(locationUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          var locationLat = data[0].lat;
          var locationLon = data[0].lon;
            GetWeatherForecast(locationLat, locationLon);
        });
      }
    });
  };

//takes the lon and lat and returns the weather into for that area 
function GetWeatherForecast(lat, lon) {
    var latLonForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&cnt=6&units=imperial&appid=e88cd06419645f7fd7b6ea89f17cda0c';
    fetch(latLonForecastUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
            displayForecast(data);
            displayBackground(data);
        });
      }
    });
  };

// GetWeatherForecast();

function displayForecast(data){
    //displays the "5 day forecast" heading
    var hidden = document.querySelector('.hidden');
    hidden.style.display= 'initial';
    //removes the forecast from previous searches
    todayForm.innerHTML = "";
    ForecastList.innerHTML = "";
    //displays the info for the today element
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

    //displays the 5 day forecast 
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

//changes the background image based on the type of weather in the searched location
function displayBackground(data) {
  if (data.list[0].weather[0].main === 'Clouds') {
    document.body.style.backgroundImage = "url('./assets/images/nikhil-dafare-4F1pwplJ18w-unsplash.jpg')";
  } else if (data.list[0].weather[0].main === 'Rain') {
    document.body.style.backgroundImage = "url('./assets/images/pexels-pixabay-414659.jpg')";
  } else if (data.list[0].weather[0].main === 'Snow') {
    document.body.style.backgroundImage = "url('./assets/images/snow.jpg')";
  } else if (data.list[0].weather[0].main === 'Thunderstorm') {
    document.body.style.backgroundImage = "url('./assets/images/thunder.jpg')";
  } else if (data.list[0].weather[0].main === 'Drizzle') {
    document.body.style.backgroundImage = "url('./assets/images/drizzle.jpg')";
  }else {
    document.body.style.backgroundImage = "url('./assets/images/james-butterly-iEPgfWwTpuM-unsplash.jpg')";
  } 
}

//displays the search history
function displaySearchHistory(){
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

//presents the search history on page load 
displaySearchHistory();


