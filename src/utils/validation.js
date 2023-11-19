
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const registrationNumberRegex = /^[A-Z0-9]+$/;
const nameRegex = /^[A-Za-z]+$/;

export function validateEmail(email) {
    return emailRegex.test(email);
}

export function validatePassword(password){
    return passwordRegex.test(password);
}

export function validateName(name){
    return name.length > 0 && nameRegex.test(name);
}

export function validateRegistraionNumber(registrationNumber) {
    return registrationNumberRegex.test(registrationNumber);
}