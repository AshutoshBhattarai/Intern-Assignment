import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default http;
