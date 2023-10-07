import axios from "axios";

const urlConst = "/reservations";

class ReservationService {
    async getReservations() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getReservationById(reservationId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + reservationId);
    }

    async createReservation(reservationData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, reservationData);
    }

    async updateReservation(reservationData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", reservationData);
    }

    async deleteReservationById(reservationId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + reservationId);
    }
}
export default new ReservationService();
