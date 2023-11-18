import axios from "axios";

const urlConst = "/parkingspots";

class ParkingSpotService {
    async getParkingSpots() {
        return await axios.get(urlConst);
    }

    async getParkingSpotById(parkingSpotId) {
        return await axios.get(urlConst + "/" + parkingSpotId);
    }

    async addParkingSpots(parkingId, parkingSpotData) {
        return await axios.post( urlConst + "/parking/" + parkingId + "/model/create", parkingSpotData);
    }

    async addParkingSpot(parkingSpotData) {
        return await axios.post(urlConst, parkingSpotData);
    }

    async updateParkingSpot(parkingSpotData) {
        return await axios.put(urlConst, parkingSpotData);
    }

    async softDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(urlConst + "/soft/" + parkingSpotId);
    }

    async hardDeleteParkingSpotById(parkingSpotId) {
        return await axios.delete(urlConst + "/hard/" + parkingSpotId);
    }

    async getParkingSpotsByParkingId(parkingId) {
        return await axios.get(urlConst + "/parking/" + parkingId);
    }

    async getFreeParkingSpotsByParkingId(parkingId, start, end) {
        return await axios.get(urlConst + "/parking/" + parkingId + "/free", {
            params: { startDate: start, endDate: end }
        });
    }
    async getOccupiedParkingSpotsMapByParkingId(parkingId, start) {
        return await axios.get(urlConst + "/parking/" + parkingId + "/free-time", {
            params: { startDate: start }
        });
    }
}
export default new ParkingSpotService();
