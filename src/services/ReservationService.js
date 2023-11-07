import axios from "axios";
import useErrorHandler from "../utils/ErrorHandler";
const urlConst = "/reservations";

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


class ReservationService {
    async getReservations() {
        return await http.get(urlConst);
    }

    async getUserReservations() {
        return await http.get(urlConst + "/client");
    }

    async getReservationById(reservationId) {
        return await http.get(urlConst + "/" + reservationId);
    }

    async createReservation(reservationData) {
        return await http.post(urlConst, reservationData);
    }

    async updateReservation(reservationData) {
        return await http.put(urlConst + "/", reservationData);
    }

    async deleteReservationById(reservationId) {
        return await http.delete(urlConst + "/" + reservationId);
    }
}
export default new ReservationService();
