import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/drones";

class DroneService {
    async getDrones() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getDroneById(droneId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + droneId, { headers: authHeader() });
    }

    async createDrone(droneData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, droneData, { headers: authHeader() });
    }

    async updateDrone(droneData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", droneData, { headers: authHeader() });
    }

    async deleteDroneById(droneId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + droneId), { headers: authHeader() };
    }
}
export default new DroneService();
