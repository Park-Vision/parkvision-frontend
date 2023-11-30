import { toast } from 'react-toastify';
import axios from 'axios';
import AuthenticationService from "../services/AuthenticationService";

let retryCounter = 0;
const maxRetries = 1;

async function useErrorHandler(error) {
    if (error.response && error.response.status === 403 && retryCounter < maxRetries) {
        const user = JSON.parse(localStorage.getItem("user"));
        const refreshToken = user.token;

        if (refreshToken) {
            try {
                const response = await AuthenticationService.refresh(refreshToken);
                const responseData = response.data;
                const newAccessToken = responseData.token;
                localStorage.setItem("user", JSON.stringify(responseData));
                error.config.headers['Authorization'] = 'Bearer ' + newAccessToken;
                retryCounter++;
                return axios(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                window.location.href = '/login'; // Redirect to login page
            }
        } else {
            console.error('No refresh token found in local storage');
            window.location.href = '/login'; // Redirect to login page
            return Promise.reject("403 Error: No Refresh Token Found");
        }
    } else if (error.message === "Network Error" && error.config && error.config.url) {
        toast.error(`Network Error: Unable to connect to ${error.config.url}`, { autoClose: false });
    } else {
        toast.error("An error occurred. Please try again.");
    }
    retryCounter = 0;
    return Promise.reject("Failure: The promise has failed!");
}

export default useErrorHandler;
