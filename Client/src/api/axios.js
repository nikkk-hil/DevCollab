import axios from "axios";
import { store, persistor } from "../store/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { clearBoard } from "../store/slices/boardSlice";
import { clearColumns } from "../store/slices/columnSlice";
import { clearCards } from "../store/slices/cardSlice";
import { clearActivities } from "../store/slices/activitySlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

function forceLogout() {
  store.dispatch(logout());
  store.dispatch(clearBoard());
  store.dispatch(clearColumns());
  store.dispatch(clearCards());
  store.dispatch(clearActivities());
  persistor.purge();
}

api.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function onRejected(error) {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshEndpoint = originalRequest?.url?.includes(
      "/user/refresh-access-token",
    );

    if (status === 401 && !isRefreshEndpoint && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/user/refresh-access-token");
        return api(originalRequest);
      } catch (refErr) {
        forceLogout();
        return Promise.reject(refErr);
      }
    }

    if (status === 401 && isRefreshEndpoint) {
      forceLogout();
    }

    // if (error.response.status === 401 && error.response.data.message.includes("Token expired")){
    //     try {
    //       await api.post("/user/refresh-access-token")
    //       return api(originalRequest);
    //     } catch (error) {
    //       return Promise.reject(error);
    //     }
    //   }

    return Promise.reject(error);
  },
);

export default api;
