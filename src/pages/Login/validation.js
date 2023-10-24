
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
export function validateEmail(email) {
    return emailRegex.test(email);
}

export function validatePassword(password){
    return passwordRegex.test(password);
}

export function validateName(name){
    return name.length > 0;
}
