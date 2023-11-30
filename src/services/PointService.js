import axios from "axios";

const urlConst = "/points";

class PointService {
    async getPoints() {
        return await axios.get(urlConst);
    }

    async getPointById(pointId) {
        return await axios.get(urlConst + "/" + pointId);
    }

    async createPoint(pointData) {
        return await axios.post(urlConst, pointData);
    }

    async updatePoint(pointData) {
        return await axios.put(urlConst + "/", pointData);
    }

    async deletePointById(pointId) {
        return await axios.delete(urlConst + "/" + pointId);
    }
}
export default new PointService();
