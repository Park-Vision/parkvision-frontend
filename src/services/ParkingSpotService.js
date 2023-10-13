import axios from "axios";

const urlConst = "/parkingspots";

class ParkingSpotService {
    async getParkingSpots() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getParkingSpotById(parkingSpotId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + parkingSpotId);
    }

    async createParkingSpot(parkingSpotData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, parkingSpotData);
    }

    async updateParkingSpot(parkingSpotData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", parkingSpotData);
    }

    async softDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/soft/" + parkingSpotId);
    }

    async hardDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/hard/" + parkingSpotId);
    }

    async getParkingSpotsByParkingId(parkingId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/parking/" + parkingId);
    }
}
export default new ParkingSpotService();
