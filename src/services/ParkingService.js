import axios from "axios";

const urlConst = "/parkings";

class ParkingService {
    async getParkings() {
        return await axios.get(urlConst);
    }

    async getParkingById(parkingId) {
        return await axios.get(urlConst + "/" + parkingId);
    }

    async createParking(parkingData) {
        return await axios.post(urlConst, parkingData);
    }

    async updateParking(parkingData) {
        return await axios.put(urlConst + "/", parkingData);
    }

    async deleteParkingById(parkingId) {
        return await axios.delete(urlConst + "/" + parkingId);
    }

    async getParkingNumOfSpotsById(parkingId) {
        return await axios.get(urlConst + "/" + parkingId + "/spots-number");
    }

    async getParkingNumOfFreeSpotsById(parkingId, start) {
        return await axios.get(urlConst + "/" + parkingId + "/free-spots-number", {
            params: { startDate: start },
        });
    }
  }
export default new ParkingService();
