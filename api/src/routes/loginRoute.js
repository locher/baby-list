import {connection} from "../connection.js";
import express from "express";
import jwt from "jsonwebtoken"
import CryptoJS from 'crypto-js';

export const loginRoute = express.Router();

// Login
loginRoute.post('/login', (req, res) => {
    const {email, password} = req.body;

    const hashedPassword = CryptoJS.SHA512(password + process.env.API_PASSWORD_SECRET).toString();

    connection.query("SELECT * FROM admins WHERE admins.email = ? AND admins.password = ?", [email, hashedPassword], (err, results) => {
        if (err) {
            res.status(500).send('Error getting logged');
        } else{
            if(results.length > 0) results[0].token = jwt.sign(email, process.env.API_TOKEN_SECRET)
            res.json(results)
        }
    });
});

//Check token
loginRoute.get('/token/:token', (req, res) => {
    const token = req.params.token;
    jwt.verify(token, process.env.API_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.json(false)
        } else {
            res.json(decoded)
        }
    });
});
