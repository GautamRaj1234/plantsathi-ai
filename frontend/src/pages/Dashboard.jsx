import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CloudSun, History, Droplets } from "lucide-react";
import { getDiagnosisHistory, getWeather } from "../api/api.js";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Muzaffarpur");

  useEffect(() => {
    getDiagnosisHistory().then(setHistory).catch(() => {});
    getWeather(city).then(setWeather).catch(() => {});
  }, []);

  const fetchWeather = () => getWeather(city).then(setWeather).catch(() => {});

  const chartData = history
    .slice(0, 8)
    .reverse()
    .map((h) => ({ name: h.disease.slice(0, 14), confidence: h.confidence }));

  const healthyCount = history.filter((h) => h.isHealthy).length;
  const issueCount = history.length - healthyCount;

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Dashboard</h1>
      <p className="mt-2 font-body text-sm text-bark/70">Health insights and weather-based care recommendations.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-5">
          <span className="font-mono text-xs uppercase tracking-wide text-mint-400">Total Scans</span>
          <p className="mt-2 font-display text-4xl text-white">{history.length}</p>
        </div>
        <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-5">
          <span className="font-mono text-xs uppercase tracking-wide text-mint-400">Healthy</span>
          <p className="mt-2 font-display text-4xl text-white">{healthyCount}</p>
        </div>
        <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-5">
          <span className="font-mono text-xs uppercase tracking-wide text-amber-400">Issues Found</span>
          <p className="mt-2 font-display text-4xl text-white">{issueCount}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <History size={16} className="text-mint-400" />
            <span className="font-display text-lg text-white">Recent Diagnoses</span>
          </div>
          {chartData.length === 0 ? (
            <p className="mt-8 font-body text-sm text-bark/40">No scans yet. Go diagnose a plant on the Scan page.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B3324" />
                  <XAxis dataKey="name" stroke="#C9BBA3" fontSize={11} />
                  <YAxis stroke="#C9BBA3" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0B1712", border: "1px solid #1B3324", borderRadius: 8, color: "#C9BBA3" }} />
                  <Bar dataKey="confidence" fill="#5ED9AC" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6">
          <div className="flex items-center gap-2">
            <CloudSun size={16} className="text-mint-400" />
            <span className="font-display text-lg text-white">Weather-Based Care</span>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
              className="flex-1 rounded-full border border-canopy-700 bg-canopy-950 px-3.5 py-1.5 font-body text-sm text-bark focus:border-mint-500 focus:outline-none"
            />
            <button onClick={fetchWeather} className="rounded-full bg-mint-500 px-3.5 py-1.5 font-body text-xs font-semibold text-canopy-950 hover:bg-mint-400">
              Go
            </button>
          </div>
          {weather && (
            <div className="mt-4">
              <p className="font-display text-3xl text-white">{weather.tempC}°C</p>
              <p className="font-body text-sm capitalize text-bark/70">{weather.description} · {weather.city}</p>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-canopy-800/60 p-3">
                <Droplets size={15} className="mt-0.5 shrink-0 text-mint-400" />
                <p className="font-body text-xs text-bark/80">{weather.careTip}</p>
              </div>
              {weather.note && <p className="mt-2 font-mono text-[10px] text-amber-400/70">{weather.note}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
