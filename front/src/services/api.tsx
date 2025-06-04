import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.11.95:3001", // IP do backend
});

export default api;
