import axios from "axios";

const urlConst = "/drones";

class DroneService {
    async getDrones() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getDroneById(droneId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + droneId);
    }

    async createDrone(droneData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, droneData);
    }

    async updateDrone(droneData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", droneData);
    }

    async deleteDroneById(droneId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + droneId);
    }
}
export default new DroneService();
