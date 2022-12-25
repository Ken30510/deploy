import axios from 'axios';

const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:4000/api";

const api = axios.create({ baseURL: API_ROOT });

export default api

// instance.get('/hi').then((data) => console.log(data));
