import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";

const urlConst = "/users";
const authUrlConst = "/auth";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

http.interceptors.response.use(
    (response) => response,
    (error) => useErrorHandler(error)
);

http.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            config.headers["Authorization"] = "Bearer " + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


class UserService {
    async getUsers() {
        return await http.get(urlConst);
    }

    async getUserById(userId) {
        return await http.get(urlConst + "/" + userId);
    }

    async createUser(userData) {
        return await http.post(urlConst, userData);
    }

    async updateUser(userData) {
        return await http.put(urlConst + "/", userData);
    }

    async deleteUserById(userId) {
        return await http.delete(urlConst + "/" + userId);
    }

    async authenticateUser(userData) {
        return await http.post(authUrlConst + "/authenticate", userData);
    }

    async registerUser(userData) {
        return await http.post(authUrlConst + "/register", userData);
    }

}
export default new UserService();
