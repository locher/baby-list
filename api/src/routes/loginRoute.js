import {connection} from "../connection.js";
import express from "express";
import jwt from "jsonwebtoken"
import crypto from "crypto";
import Client from "node-mailjet";
import { encryptPassword } from "../utils/password.js"

export const loginRoute = express.Router();

// Login
loginRoute.post('/login', (req, res) => {
    const {email, password} = req.body;

    connection.query("SELECT * FROM admins WHERE admins.email = ? AND admins.password = ?", [email, encryptPassword(password)], (err, results) => {
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

// Request new password
loginRoute.post('/request-password', (req, res) => {
    const { email } = req.body;

    // Email function

    const sendEmail = async (email, uuid) => {

        const mailjet = new Client({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE
        });

        await (async () => {

            const emailData = {
                Messages: [
                    {
                        From: {
                            Email: "shop@herrloc.fr",
                            Name: "Les Moslherr"
                        },
                        To: [
                            {
                                Email: email
                            }
                        ],
                        TemplateID: 5117723,
                        TemplateLanguage: true,
                        Subject: `🐥 Changement de mot de passe`,
                        Variables: {
                            resetPasswordUrl: `${process.env.APP_PUBLIC_URL}/reset-password/${uuid}`
                        }
                    }
                ]
            };

            try {
                const sendResult = await mailjet.post("send", { version: "v3.1" }).request(emailData)
            } catch (err) {
                console.error(err.statusCode);
                throw err; // Vous pouvez gérer l'erreur en renvoyant une réponse d'erreur appropriée ici
            }

        })();


    };

    // Check if email exists
    connection.query("SELECT email FROM admins WHERE admins.email = ?", [email], (err, results) => {
        if (!err && results.length > 0) {

            // If email exists, generate a UUID and update the database
            const uuid = crypto.randomUUID();
            const now = new Date();

            connection.query("UPDATE admins SET uuid_password_request = ?, date_password_request = ? WHERE email = ?", [uuid, now, email], async (err, results) => {
                if (!err) {
                    // Send Email
                    await sendEmail(email, uuid)
                    res.json({emailExist: true, message: 'Password reset link sent successfully.'});
                } else {
                    res.status(500).json({error: 'Internal server error'});
                }
            });
        } else {
            res.json({ emailExist: false });
        }
    });
});


// Change password
loginRoute.put('/change-password', (req, res) => {

    const {uuid, newPassword} = req.body;

    // Récupérer la ligne correspondante pour voir si l'UUID existe et que la demande a été faites dans l'heure
    connection.query("SELECT date_password_request FROM admins WHERE uuid_password_request = ?", [uuid], (err, results) => {
        if (!err && results.length > 0) {

            const now = new Date();
            const dateRequest = new Date(results[0]?.date_password_request)

            const millisecondsInHour = (milliseconds) => {
                return milliseconds / 1000 / 60 / 60
            }

            if (millisecondsInHour(now - dateRequest) < 1){
                connection.query('UPDATE admins SET password = ?, date_password_request = ?, uuid_password_request = ?  WHERE uuid_password_request = ?', [encryptPassword(newPassword), null, null, uuid], (err, result) => {
                    if (err) {
                        console.error('Error updating admin:', err);
                        res.status(500).send({error: true, errorReason : 'Error updating admin'});
                    } else {
                        res.json({error: false});
                    }
                });

            }else{
                res.status(404).send({error: true, errorReason: 'Le lien est expiré, veuillez redemander un mot de passe et faire le changement dans l\'heure qui suit.'});
            }

        } else {
            res.status(404).send({error: true, errorReason: 'Ce lien n\'existe pas.'});
        }
    })
});
