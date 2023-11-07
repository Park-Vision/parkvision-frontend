import axios from "axios";

const urlConst = "/points";

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

http.interceptors.response.use(
    (response) => response,
    (error) => useErrorHandler(error)
);

http.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            config.headers["Authorization"] = "Bearer " + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class PointService {
    async getPoints() {
        return await http.get(urlConst);
    }

    async getPointById(pointId) {
        return await http.get(urlConst + "/" + pointId);
    }

    async createPoint(pointData) {
        return await http.post(urlConst, pointData);
    }

    async updatePoint(pointData) {
        return await http.put(urlConst + "/", pointData);
    }

    async deletePointById(pointId) {
        return await http.delete(urlConst + "/" + pointId);
    }
}
export default new PointService();
