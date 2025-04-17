import "./style.css";

// Z2VNGZRYMTFGL73BGN3UPCULB
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const conversion = (temp) => {
  let fahrenheit = false;

  return !fahrenheit ? `${(((temp - 32) * 5) / 9).toFixed(1)}°C` : `${temp}°F`;
};

const loc = document.querySelector("#loc");
const btn = document.querySelector("button");
const form = document.querySelector("form");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  getWeatherFrom(loc.value);
  form.reset();
});

async function getWeatherFrom(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Z2VNGZRYMTFGL73BGN3UPCULB`,
      { mode: "cors" },
    );

    if (!response.ok) {
      throw new Error("City not found!");
    }

    const data = await response.json();
    const weatherData = getWeatherData(data);
    displayWeatherData(weatherData);
    displayForecastData(data);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    alert(err.message || "An unknown error occurred");
  }
}

function getWeatherData(data) {
  const address = data.resolvedAddress;
  const resolvedAddress = address.split(/[\s,]+/);
  let result;
  if (resolvedAddress.length === 1) {
    result = resolvedAddress[0];
  } else {
    result = `${resolvedAddress[0]}, ${resolvedAddress[resolvedAddress.length - 1]}`;
  }
  const weatherData = {
    address: result,
    temp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    feelsLike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    windSpeed: data.currentConditions.windspeed,
    pressure: data.currentConditions.pressure,
  };
  return weatherData;
}

function displayWeatherData(data) {
  const city = document.querySelector(".city");
  const temperature = document.querySelector(".temperature");
  const condition = document.querySelector(".condition");
  const felt = document.querySelector(".feel");
  const humidity = document.querySelector(".humidity-percentage");
  const wind = document.querySelector(".wind-speed-value");
  const feels = document.querySelector(".feels-like-value");
  const pressure = document.querySelector(".pressure-value");

  city.textContent = data.address;
  condition.textContent = data.conditions;
  felt.textContent = `Feels like ${conversion(data.feelsLike)}`;
  temperature.textContent = conversion(data.temp);
  humidity.textContent = `${data.humidity}%`;
  wind.textContent = `${data.windSpeed} km/h`;
  feels.textContent = conversion(data.feelsLike);
  pressure.textContent = `${data.pressure} hPa`;
}

function displayForecastData(data) {
  const days = data.days;
  for (const [index, day] of days.entries()) {
    if (index === 0) continue;
    if (index > 5) break;

    const date = new Date(days[index + 1].datetime);
    const dayCondition = document.querySelector(`.day-card${index}-condition`);
    const weekDay = document.querySelector(`.day-card${index}`);
    const feelsMax = document.querySelector(`.feelsMax${index}`);
    const feelsMin = document.querySelector(`.feelsMin${index}`);

    dayCondition.textContent = day.conditions;
    weekDay.textContent = weekDays[date.getDay()];
    feelsMax.textContent = conversion(day.feelslikemax);
    feelsMin.textContent = conversion(day.feelslikemin);
  }
}

document.addEventListener("DOMContentLoaded", getWeatherFrom("London"));
