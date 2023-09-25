import CryptoJS from "crypto-js";

export const encryptPassword = (password) => {
    return CryptoJS.SHA512(password + process.env.API_PASSWORD_SECRET).toString();
}
