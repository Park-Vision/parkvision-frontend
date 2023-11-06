import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/payments";
class PaymentService {
    async getPayments() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getPaymentById(paymentId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + paymentId, { headers: authHeader() });
    }

    async deletePaymentById(paymentId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + paymentId, {
            headers: authHeader(),
        });
    }

    async addPayment(paymentData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, paymentData, { headers: authHeader() });
    }

    async updatePayment(paymentData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst, paymentData, { headers: authHeader() });
    }
}
export default new PaymentService();