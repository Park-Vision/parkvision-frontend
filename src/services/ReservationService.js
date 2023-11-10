import axios from "axios";

const urlConst = "/reservations";

class ReservationService {
    async getReservations() {
        console.log(await axios.get(urlConst));
        return await axios.get(urlConst);
    }

    async getUserReservations() {
        return await axios.get(urlConst + "/client");
    }

    async getReservationById(reservationId) {
        return await axios.get(urlConst + "/" + reservationId);
    }

    async createReservation(reservationData) {
        return await axios.post(urlConst, reservationData);
    }

    async updateReservation(reservationData) {
        return await axios.put(urlConst + "/", reservationData);
    }

    async deleteReservationById(reservationId) {
        return await axios.delete(urlConst + "/" + reservationId);
    }
}
export default new ReservationService();
