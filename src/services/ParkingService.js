import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/parkings";

class ParkingService {
    async getParkings() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getParkingById(parkingId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + parkingId);
    }

    async createParking(parkingData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, parkingData, { headers: authHeader() });
    }

    async updateParking(parkingData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", parkingData, { headers: authHeader() });
    }

    async deleteParkingById(parkingId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + parkingId, { headers: authHeader() });
    }
}
export default new ParkingService();
