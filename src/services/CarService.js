import axios from "axios";

const urlConst = "/cars";

class CarService {
    async getCars() {
        return await axios.get(urlConst);
    }

    async getUserCars() {
        return await axios.get(urlConst + "/client");
    }

    async getCarById(carId) {
        return await axios.get(urlConst + "/" + carId);
    }

    async deleteCarById(carId) {
        return await axios.delete(urlConst + "/" + carId);
    }

    async addCar(carData) {
        return await axios.post(urlConst, carData);
    }

    async updateCar(carData) {
        return await axios.put(urlConst, carData);
    }
}
export default new CarService();
