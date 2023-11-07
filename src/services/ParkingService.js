import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";

const urlConst = "/parkings";

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


class ParkingService {
    async getParkings() {
        return await http.get(urlConst);
    }

    async getParkingById(parkingId) {
        return await http.get(urlConst + "/" + parkingId);
    }

    async createParking(parkingData) {
        return await http.post(urlConst, parkingData);
    }

    async updateParking(parkingData) {
        return await http.put(urlConst + "/", parkingData);
    }

    async deleteParkingById(parkingId) {
        return await http.delete(urlConst + "/" + parkingId);
    }

    async getParkingNumOfSpotsById(parkingId) {
        return await http.get(urlConst + "/" + parkingId + "/spots-number");
    }

    async getParkingNumOfFreeSpotsById(parkingId, start) {
        return await http.get(urlConst + "/" + parkingId + "/free-spots-number", {
            params: { startDate: start },
        });
    }
  }
export default new ParkingService();
