import axios from "axios";

const instance = axios.create({
  baseURL: "https://diorama.bkhole.app/",
  headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' },
  timeout: 20000
});

// instance.interceptors.request.use(async function (config) {
//     const token = localStorage.getItem("access_token");

//     if(token !== null)
//       config.headers['Authorization'] = `Bearer ${token}`;

//     return config;
// }, function (error) {
//   return Promise.reject(error)
// })

export default instance