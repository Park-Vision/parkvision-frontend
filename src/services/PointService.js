import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/points";

class PointService {
    async getPoints() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getPointById(pointId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + pointId, { headers: authHeader() });
    }

    async createPoint(pointData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, pointData, { headers: authHeader() });
    }

    async updatePoint(pointData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", pointData, { headers: authHeader() });
    }

    async deletePointById(pointId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + pointId, { headers: authHeader() });
    }
}
export default new PointService();
