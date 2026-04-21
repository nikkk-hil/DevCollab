import api from "./axios";

const getUser = () => api.get("/user/")
const getUserByUsernameOrEmail = (usernameOrEmail) => api.get(`/user/search?usernameOrEmail=${usernameOrEmail}`)
const regiterUser = (data) => api.post("/user/register", data)
const loginUser = (data) => api.post("/user/login", data);
const logoutUser = () => api.post("/user/logout")
const refresh_access_token = () => api.post("/user/refresh-access-token")

export {
    getUser,
    getUserByUsernameOrEmail,
    regiterUser,
    loginUser,
    logoutUser,
    refresh_access_token
}