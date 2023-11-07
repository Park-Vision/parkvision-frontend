import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";

const urlConst = "/cars";

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

class CarService {
    async getCars() {
        return await http.get(urlConst);
    }

    async getUserCars() {
        return await http.get(urlConst + "/client");
    }

    async getCarById(carId) {
        return await http.get(urlConst + "/" + carId);
    }

    async deleteCarById(carId) {
        return await http.delete(urlConst + "/" + carId);
    }

    async addCar(carData) {
        return await http.post(urlConst + "/", carData);
    }

    async updateCar(carData) {
        return await http.put(urlConst, carData);
    }
}
export default new CarService();
