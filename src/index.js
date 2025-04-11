import "./style.css";

// Z2VNGZRYMTFGL73BGN3UPCULB
const loc = document.querySelector("#loc");
const btn = document.querySelector("button");

btn.addEventListener("click", () => {
  const capitalize = loc.value[0].toUpperCase() + loc.value.slice(1);
  getWeatherFrom(capitalize);
});

async function getWeatherFrom(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
      ${location}?key=Z2VNGZRYMTFGL73BGN3UPCULB`,
      { mode: "cors" },
    );

    if (!response.ok) {
      throw new Error("Invalid input");
    }

    const data = await response.json();
    const weatherData = getWeatherData(data);

    displayWeatherData(weatherData);
  } catch (err) {
    alert(err);
  }
}

function getWeatherData(data) {
  const weatherData = {
    address: data.resolvedAddress.split(",")[0].trim(),
    temp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
  };
  return weatherData;
}

function displayWeatherData({ address, temp, conditions }) {
  // const container = document.querySelector('.container');
  const loc = document.querySelector(".address");
  const temperature = document.querySelector(".temp");
  const condition = document.querySelector(".condition");

  let fahrenheit = false;

  loc.textContent = address;
  temperature.textContent = !fahrenheit
    ? `${(((temp - 32) * 5) / 9).toFixed(1)}°C`
    : `${temp}°F`;
  condition.textContent = conditions;
}
