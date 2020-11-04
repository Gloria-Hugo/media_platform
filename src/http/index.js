import axios from "axios";
import router from "../router";
// import has256 from "@/uitls/has256.js";
import { Message } from "element-ui";
// var timeer = Date.parse(new Date());
var name = sessionStorage.getItem("userName");
// var authorization = has256.sha256_digest(`app663988/POST/${name}/${timeer}`)
const http = axios.create({
  timeout:6000,
});

http.interceptors.request.use(config=>{
  if(name){
    config.headers['Authorization'] = sessionStorage.getItem("authorization");
    config.headers['Content-Type'] = "application/json";
    config.headers.common["HyToken"] = sessionStorage.getItem("Token");
  }
  return config
},error=>{
  return Promise.reject(error)
})
http.interceptors.response.use(
  (res) => {
    if (res.data.netCode == 111) {
      sessionStorage.clear();
      Message({
        type: "error",
        message: "登录已失效，请重新登录！",
        duration: 3000,
      });
       router.push("/")
      
    }else if(res.data.netCode!=200){
      Message({
        type: 'error',
        message: res.data.errorMessage,
        duration: 3000,
      })
    }
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default http;
