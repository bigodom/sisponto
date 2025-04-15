import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.11.234:3013", // IP do backend
});

export default api;
