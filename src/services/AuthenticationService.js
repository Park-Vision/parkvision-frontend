import axios from "axios";

const urlConst = "/auth";
const user = "user"

class AuthenticationService {
    login(email, password){
        return axios
            .post(process.env.REACT_APP_BACKEND_URL + urlConst + "/authenticate", {username: email, password})
            .then((response) => {
                if (response.data.accessToken){
                    localStorage.setItem(user, JSON.stringify(response.data))
                }
                return response.data
            })
    }

    logout(){
        localStorage.removeItem(user)
    }

    register(email, firstName, lastName, password){
        return axios.post(process.env.REACT_APP_BACKEND_URL + urlConst + "/register",
            {email, firstName, lastName, password})

    }
}
export default new AuthenticationService();