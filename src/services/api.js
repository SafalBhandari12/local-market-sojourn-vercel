import axios from "axios";

const api = axios.create({
  baseURL: "https://shojourn-express-backend.onrender.com",
});

export default api;