import axios from "axios";

const urlConst = "/points";

class PointService {
    async getPoints() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getPointById(pointId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + pointId);
    }

    async createPoint(pointData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, pointData);
    }

    async updatePoint(pointData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", pointData);
    }

    async deletePointById(pointId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + pointId);
    }
}
export default new PointService();
