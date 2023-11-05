import axios from "axios";
import authHeader from "./AuthenticationHeader";

const urlConst = "/users";
const authUrlConst = "/auth";

class UserService {
    async getUsers() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst, { headers: authHeader() });
    }

    async getUserById(userId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + userId,{ headers: authHeader() });
    }

    async createUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, userData, { headers: authHeader() });
    }

    async updateUser(userData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", userData, { headers: authHeader() });
    }

    async deleteUserById(userId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + userId, { headers: authHeader() });
    }

    async authenticateUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + authUrlConst + "/authenticate", userData, { headers: authHeader() });
    }

    async registerUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + authUrlConst + "/register", userData, { headers: authHeader() });
    }

}
export default new UserService();
