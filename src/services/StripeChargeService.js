import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/payments/charge";
class StripeChargeService {
    async getStripeCharges() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getStripeChargeById(chargeId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + chargeId, { headers: authHeader() });
    }

    async deleteStripeChargeById(chargeId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + chargeId, {
            headers: authHeader(),
        });
    }

    async addStripeCharge(chargeData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, chargeData, { headers: authHeader() });
    }

}

export default new StripeChargeService();
