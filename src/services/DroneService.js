import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";
const urlConst = "/drones";

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

class DroneService {
    async getDrones() {
        return await http.get(urlConst);
    }

    async getDroneById(droneId) {
        return await http.get(urlConst + "/" + droneId);
    }

    async createDrone(droneData) {
        return await http.post(urlConst, droneData);
    }

    async updateDrone(droneData) {
        return await http.put(urlConst + "/", droneData);
    }

    async deleteDroneById(droneId) {
        return await http.delete(urlConst + "/" + droneId);
    }
}
export default new DroneService();
