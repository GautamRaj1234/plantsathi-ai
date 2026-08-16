import { Router } from "express";
import axios from "axios";

const router = Router();

/**
 * GET /api/weather?city=Muzaffarpur
 * or  /api/weather?lat=26.12&lon=85.39
 */
router.get("/", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "your_openweather_api_key_here") {
      return res.json(mockWeather(city || "Your City"));
    }

    const params = { appid: apiKey, units: "metric" };
    if (city) params.q = city;
    else if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      return res.status(400).json({ error: "Provide city or lat/lon" });
    }

    const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", { params });

    const result = {
      city: data.name,
      tempC: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: data.wind.speed
    };

    res.json({ ...result, careTip: careTipFor(result) });
  } catch (err) {
    console.error("Weather error:", err.response?.data || err.message);
    res.json(mockWeather(req.query.city || "Your City"));
  }
});

function careTipFor({ tempC, humidity, condition }) {
  const tips = [];
  if (tempC >= 32) tips.push("High heat — water early morning or evening to reduce evaporation loss.");
  if (tempC <= 10) tips.push("Cold weather — protect sensitive plants from frost and reduce watering frequency.");
  if (humidity >= 80) tips.push("High humidity increases fungal disease risk — ensure good air circulation.");
  if (humidity <= 30) tips.push("Low humidity — mist leaves or group plants to raise local humidity.");
  if (/rain/i.test(condition)) tips.push("Rain expected — skip manual watering and check for waterlogging.");
  if (tips.length === 0) tips.push("Conditions look moderate — maintain your regular watering schedule.");
  return tips.join(" ");
}

function mockWeather(city) {
  const result = { city, tempC: 31, humidity: 68, condition: "Clouds", description: "scattered clouds", windSpeed: 3.2 };
  return { ...result, careTip: careTipFor(result), note: "Demo data — add OPENWEATHER_API_KEY in backend/.env for live weather." };
}

export default router;
