import axios from "axios";

const urlConst = "/users";
const authUrlConst = "/auth";

class UserService {
    async getUsers() {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst);
    }

    async getUserById(userId) {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + userId);
    }

    async createUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + urlConst, userData);
    }

    async updateUser(userData) {
        return await axios.put(process.env.REACT_APP_BACKEND_URL + urlConst + "/", userData);
    }

    async deleteUserById(userId) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + urlConst + "/" + userId);
    }

    async authenticateUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + authUrlConst + "/authenticate", userData);
    }

    async registerUser(userData) {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + authUrlConst + "/register", userData);
    }
}
export default new UserService();
