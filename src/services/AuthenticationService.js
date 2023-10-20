import axios from "axios";

const urlConst = "/auth";
const user = "user";

class AuthenticationService {
    async login(email, password) {
        return await axios
            .post(process.env.REACT_APP_BACKEND_URL + urlConst + "/authenticate", { email: email, password: password })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem(user, JSON.stringify(response.data));
                    console.log(localStorage.getItem(user));
                }
                return response;
            });
    }

    logout() {
        localStorage.removeItem(user);
        console.log("Logout sucessful ls: " + localStorage.getItem(user));
    }

    register(email, firstName, lastName, password) {
        return axios.post(process.env.REACT_APP_BACKEND_URL + urlConst + "/register", {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
        });
    }
}
export default new AuthenticationService();
