import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach the saved auth token to every outgoing request, if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("plantsathi_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the backend says our session is invalid/expired, clear it so the
// person is prompted to log in again instead of seeing confusing errors.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("plantsathi_token");
    }
    return Promise.reject(err);
  }
);

export const identifyPlant = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/identify", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const diagnoseDisease = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/diagnose", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const getDiagnosisHistory = async () => {
  const { data } = await api.get("/diagnose/history");
  return data;
};

export const sendChatMessage = async (message, context, history) => {
  const { data } = await api.post("/chat", { message, context, history });
  return data;
};

export const getWeather = async (city) => {
  const { data } = await api.get("/weather", { params: { city } });
  return data;
};

export const getGarden = async () => {
  const { data } = await api.get("/garden");
  return data;
};

export const addPlantToGarden = async (plant) => {
  const { data } = await api.post("/garden", plant);
  return data;
};

export const updatePlant = async (id, updates) => {
  const { data } = await api.patch(`/garden/${id}`, updates);
  return data;
};

export const deletePlant = async (id) => {
  await api.delete(`/garden/${id}`);
};

export default api;
