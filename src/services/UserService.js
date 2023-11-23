import axios from "axios";

const urlConst = "/users";
const authUrlConst = "/auth";

class UserService {
    async getUsers() {
        return await axios.get(urlConst);
    }

    async getUserById(userId) {
        return await axios.get(urlConst + "/" + userId);
    }

    async createUser(userData) {
        return await axios.post(urlConst, userData);
    }

    async updateUser(userData) {
        return await axios.put(urlConst, userData);
    }

    async deleteUserById(userId) {
        return await axios.delete(urlConst + "/" + userId);
    }

    async authenticateUser(userData) {
        return await axios.post(authUrlConst + "/authenticate", userData);
    }

    async registerUser(userData) {
        return await axios.post(authUrlConst + "/register", userData);
    }

    async resetPassword(email) {
        return await axios.post(urlConst + "/resetPassword", { email:email });
    }

    async setPasswordFromReset(userData) {
        return await axios.post(urlConst + "/setPasswordFromReset", userData);
    }

    async updateName(userData) {
        return await axios.post(urlConst + "/updatePassword", userData);
    }

    async updatePassword(userData) {
        return await axios.post(urlConst + "/updateName", userData);
    }

}
export default new UserService();
