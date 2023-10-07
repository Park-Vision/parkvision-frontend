import axios from "axios";


const urlConst = "/cars"
class CarService{

    async getCars(){
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst)
    }

    async getCarById(carId){
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + '/' + carId)
    }

    async deleteCarById(carId){
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + '/' + carId)
    }

    async addCar(carData){
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst + '/', carData)
    }

    async updateCar(carData){
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst, carData)
    }

}
export default new CarService();
