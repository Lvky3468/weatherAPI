const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page refresh

  const city = document.getElementById("city").value;

  getWeather(city, "", "");
  //   console.log(city);
});

function getLocation() {
  const weatherDiv = document.getElementById("weather");

  weatherDiv.innerHTML = `<p align='center'>Loading....</p>`;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      //    console.log(latitude);
      //      console.log(longitude);

      getWeather("", latitude, longitude);
    },
    (error) => {
      console.log(error.message);
    },
  );
}

const api_key = "8ebc6ad2d22793ca8b8f30adbd06d7a3";
document.getElementById("locationBtn").addEventListener("click", getLocation);

function getUnits(unitType) {
  if (unitType === "metric") {
    return {
      temp: "°C",
      speed: "m/s",
    };
  }

  if (unitType === "imperial") {
    return {
      temp: "°F",
      speed: "mph",
    };
  }

  return {
    temp: "K",
    speed: "m/s",
  };
}

function getWeather(location = "", lat = "", lon = "") {
  let url = "";
  const weatherDiv = document.getElementById("weather");

  weatherDiv.innerHTML = `<p align='center'>Loading....</p>`;

  let type = document.getElementById("info_type").value;

  let unitsval = document.getElementById("weather-units").value;

  if (location) {
    url = `https://api.openweathermap.org/data/2.5/${type}?q=${location}&appid=${api_key}&units=${unitsval}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${api_key}&units=${unitsval}`;
  }

  //   console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);

      if (data.cod && Number(data.cod) !== 200) {
        weatherDiv.innerHTML = `<p style="color:red;text-align:center;">${data.message}</p>`;
        return;
      }

      const units = getUnits(unitsval);

      if (type === "forecast") {
        const forecastHTML = data.list
          .slice(0, 8)
          .map(
            (item) => `
                    <div class="forecast-card">
                        <h4>${item.dt_txt}</h4>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                        <p>${item.main.temp}${units.temp}</p>
                        <p>${item.weather[0].main}</p>
                        <p>${item.weather[0].description}</p>un
                    </div>
                `,
          )
          .join("");

        weatherDiv.innerHTML = `
                <h2>${data.city.name}</h2>

                <div class="forecast-container">
                ${forecastHTML}
                </div>
                `;
      } else {
        weatherDiv.innerHTML = `
            <div class="weather-card">

                <div class="weather-header">
                    <div>
                        <h2>${data.name}</h2>
                        <p>${data.weather[0].description}</p>
                    </div>

                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                </div>

                <div class="weather-grid">

                    <div class="weather-item">
                        <h4>Temperature</h4>
                        <p>${data.main.temp}${units.temp}</p>
                    </div>

                    <div class="weather-item">
                        <h4>Feels Like</h4>
                        <p>${data.main.feels_like}${units.temp}</p>
                    </div>

                    <div class="weather-item">
                        <h4>Humidity</h4>
                        <p>${data.main.humidity}%</p>
                    </div>

                    <div class="weather-item">
                        <h4>Wind Speed</h4>
                        <p>${data.wind.speed} ${units.speed}</p>
                    </div>

                </div>

            </div>
        `;
      }
    })
    .catch((error) => {
      const weatherDiv = document.getElementById("weather");
      weatherDiv.innerHTML = `<p style='color:Red;text-align:Center;'>Enter the correct city!</p>`;
      console.log(error);
    });
}
