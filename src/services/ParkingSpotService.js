import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";

const urlConst = "/parkingspots";

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

class ParkingSpotService {
    async getParkingSpots() {
        return await http.get(urlConst);
    }

    async getParkingSpotById(parkingSpotId) {
        return await http.get(urlConst + "/" + parkingSpotId);
    }

    async createParkingSpot(parkingId, parkingSpotData) {
        return await http.post( urlConst + "/parking/" + parkingId + "/model/create", parkingSpotData);
    }

    async updateParkingSpot(parkingSpotData) {
        return await http.put(urlConst, parkingSpotData);
    }

    async softDeleteParkingSpotById(parkingSpotId) {
        return await http.delete(urlConst + "/soft/" + parkingSpotId);
    }

    async hardDeleteParkingSpotById(parkingSpotId) {
        return await http.delete(urlConst + "/hard/" + parkingSpotId);
    }

    async getParkingSpotsByParkingId(parkingId) {
        return await http.get(urlConst + "/parking/" + parkingId);
    }

    async getFreeParkingSpotsByParkingId(parkingId, start, end) {
        return await http.get(urlConst + "/parking/" + parkingId + "/free", {
            params: { startDate: start, endDate: end }
        });
    }
    async getOccupiedParkingSpotsMapByParkingId(parkingId, start) {
        return await http.get(urlConst + "/parking/" + parkingId + "/free-time", {
            params: { startDate: start }
        });
    }
}
export default new ParkingSpotService();
