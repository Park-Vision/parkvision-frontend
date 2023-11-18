import axios from "axios";

const urlConst = "/drone-missions";

class DroneMissionService {
    async getDroneMissions() {
        return await axios.get(urlConst);
    }

    async getDroneMissionById(droneMissionId) {
        return await axios.get(urlConst + "/" + droneMissionId);
    }

    async createDroneMission(droneMissionData) {
        return await axios.post(urlConst, droneMissionData);
    }

    async updateDroneMission(droneMissionData) {
        return await axios.put(urlConst + "/", droneMissionData);
    }

    async deleteDroneMissionById(droneMissionId) {
        return await axios.delete(urlConst + "/" + droneMissionId);
    }
}

export default new DroneMissionService();