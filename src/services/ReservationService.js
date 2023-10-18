import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/reservations";

class ReservationService {
    async getReservations() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getReservationById(reservationId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + reservationId, { headers: authHeader() });
    }

    async createReservation(reservationData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, reservationData, { headers: authHeader() });
    }

    async updateReservation(reservationData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", reservationData, { headers: authHeader() });
    }

    async deleteReservationById(reservationId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + reservationId, { headers: authHeader() });
    }
}
export default new ReservationService();
