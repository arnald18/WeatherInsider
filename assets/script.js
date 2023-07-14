let apiKey = "56f2a681bd292c01c765c27e1a2865a3";

$(function () {
  // start function
  // when want hit search, we want to get the input value

  $("#search-form").on("submit", function (event) {
    event.preventDefault();

    let searchValue = $("#search").val().trim();

    getCoordinates(searchValue);
  });

  // use the geocoding api to get the location of the city

  function getCoordinates(cityName) {
    let apiUrl =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&limit=1&appid=" +
      apiKey;

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        saveCity();
        getWeather(data[0]);
        getForecast(data[0]);
      });
  }

  function getWeather(data) {
    let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?";

    weatherUrl += "lat=" + data.lat;

    weatherUrl += "&";

    weatherUrl += "lon=" + data.lon;

    weatherUrl += "&";

    weatherUrl += "units=imperial";
    weatherUrl += "&";

    weatherUrl += "appid=" + apiKey;

    fetch(weatherUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        displayWeather(data);
      });
  }

  function displayWeather(data) {
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;

    let date = dayjs().format("M/D/YYYY");

    let container = $("#current-weather");
    container.html("");

    // add date
    let dateTextHeading = $("<h3>");
    dateTextHeading.text(date);
    container.append(dateTextHeading);
    // add temp
    let tempParagraph = $("<p>");
    tempParagraph.text(temp);
    container.append(tempParagraph);
    // add humidity
    let humidityParagraph = $("<p>");
    humidityParagraph.text(humidity);
    container.append(humidityParagraph);

    //  add wind speed
    let windSpeedParagraph = $("<p>");
    windSpeedParagraph.text(windSpeed);
    container.append(windSpeedParagraph);
  }

  // with the latitude and longitude we'll use the weather api to get the forecast

  function getForecast(data) {
    let forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?";

    forecastUrl += "lat=" + data.lat;

    forecastUrl += "&";

    forecastUrl += "lon=" + data.lon;

    forecastUrl += "&";
    forecastUrl += "units=imperial";
    forecastUrl += "&";

    forecastUrl += "appid=" + apiKey;

    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        displayForecast(data);
      });
  }

  // display the forecast on the screen and add the city to the cities list

  function displayForecast(data) {
    $("#forecast-5").html("");
    for (let i = 3; i < data.list.length; i += 8) {
      let dateText = data.list[i].dt_txt;
      let temp = data.list[i].main.temp;
      let humidity = data.list[i].main.humidity;
      let windSpeed = data.list[i].wind.speed;

      let container = $("<div>");

      // add date
      let dateTextHeading = $("<h3>");
      dateTextHeading.text(dayjs(dateText).format("M/D/YYYY"));
      container.append(dateTextHeading);
      // add temp
      let tempParagraph = $("<p>");
      tempParagraph.text(temp);
      container.append(tempParagraph);
      // add humidity
      let humidityParagraph = $("<p>");
      humidityParagraph.text(humidity);
      container.append(humidityParagraph);

      //  add wind speed
      let windSpeedParagraph = $("<p>");
      windSpeedParagraph.text(windSpeed);
      container.append(windSpeedParagraph);

      // add container to html

      $("#forecast-5").append(container);
    }
  }
  function saveCity() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    if (cities === null) {
      cities = [];
    }

    let city = $("#search").val();

    if (!cities.includes(city)) {
      cities.unshift(city);
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    displayCities();
  }

  function displayCities() {
    let citiesList = $("#cities-list");

    citiesList.html("");

    let cities = JSON.parse(localStorage.getItem("cities"));

    for (let i = 0; i < cities.length; i++) {
      let cityButton = $("<button>");
      cityButton.text(cities[i]);

      cityButton.on("click", function () {
        getCoordinates(cities[i]);
      });

      citiesList.append(cityButton);
    }
  }
});
