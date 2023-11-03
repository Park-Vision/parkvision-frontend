import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/parkingspots";

class ParkingSpotService {
    async getParkingSpots() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getParkingSpotById(parkingSpotId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + parkingSpotId, { headers: authHeader() });
    }

    async createParkingSpot(parkingId, parkingSpotData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst + "/parking/" + parkingId + "/model/create", parkingSpotData, { headers: authHeader() });
    }

    async updateParkingSpot(parkingSpotData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst, parkingSpotData,
            { headers: authHeader() });
    }

    async softDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/soft/" + parkingSpotId, { headers: authHeader() });
    }

    async hardDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/hard/" + parkingSpotId, { headers: authHeader() });
    }

    async getParkingSpotsByParkingId(parkingId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/parking/" + parkingId, { headers: authHeader() });
    }

    async getFreeParkingSpotsByParkingId(parkingId, start, end) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/parking/" + parkingId + "/free", {
            params: { startDate: start, endDate: end },
            headers: authHeader(),
        });
    }
    async getOccupiedParkingSpotsMapByParkingId(parkingId, start) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/parking/" + parkingId + "/free-time", {
            params: { startDate: start },
            headers: authHeader(),
        });
    }
}
export default new ParkingSpotService();
