import axios from "axios";
import has256 from "@/uitls/has256.js";
var timeer = Date.parse(new Date());
var name = sessionStorage.getItem("userName");
// console.log(sessionStorage.getItem("authorization"))
// var authorization = has256.sha256_digest(`app663988/POST/${name}/${timeer}`)
// var http;
// if (name) {
  const http = axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionStorage.getItem("authorization"),
      HyToken: sessionStorage.getItem("Token")
    }
  });
// }

http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    return Promise.reject(err);
  }
);

export default http;
