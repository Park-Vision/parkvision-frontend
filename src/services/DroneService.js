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

    async commandDrone(droneId, command) {
        return await axios.post(urlConst + "/" + droneId + "/" + command)
    }

    async getDronesByParkingId(parkingId) {
        return await axios.get(urlConst + "/parking/" + parkingId);
    }
}
export default new DroneService();
