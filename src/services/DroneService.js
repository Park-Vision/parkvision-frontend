import axios from "axios";

const urlConst = "/drones";

class DroneService {
    async getDrones() {
        return await axios.get(urlConst);
    }

    async getDroneById(droneId) {
        return await axios.get(urlConst + "/" + droneId);
    }

    async createDrone(droneData) {
        return await axios.post(urlConst, droneData);
    }

    async updateDrone(droneData) {
        return await axios.put(urlConst + "/", droneData);
    }

    async deleteDroneById(droneId) {
        return await axios.delete(urlConst + "/" + droneId);
    }
}
export default new DroneService();
