import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/cars";
class CarService {
    async getCars() {
        console.log(authHeader());
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getUserCars() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/client", { headers: authHeader() });
    }

    async getCarById(carId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + carId, { headers: authHeader() });
    }

    async deleteCarById(carId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + carId, {
            headers: authHeader(),
        });
    }

    async addCar(carData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst + "/", carData, { headers: authHeader() });
    }

    async updateCar(carData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst, carData, { headers: authHeader() });
    }
}
export default new CarService();
