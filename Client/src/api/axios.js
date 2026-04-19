import axios from "axios";
import { useNavigate } from "react-router-dom";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

api.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, async function onRejected(error) {
    
    const originalRequest = error.config;
    if (error.response.status === 401 && error.response.data.message.includes("Token expired")){
        await api.post("/user/refresh-access-token")
        return api(originalRequest);
    }

    return Promise.reject(error);
  });


export default api