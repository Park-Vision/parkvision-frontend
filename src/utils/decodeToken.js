const decodeToken = (token) => {
    if (typeof token !== "string" || !token) {
        return null;
    }
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        return null;
    }
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    return decodedToken;
};

export default decodeToken;
