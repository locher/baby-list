import express from 'express';
import * as crypto from "crypto";

import Client from 'node-mailjet';

import {connection} from "../connection.mjs";

export const itemsRoutes = express.Router();

// Get all Gifts
itemsRoutes.get('/items/:type', (req, res) => {
    const type = req.params.type;
    connection.query('SELECT * FROM items WHERE items.type = ?', type, (err, results) => {
        if (err) {
            console.error('Error getting items:', err);
            res.status(500).send('Error getting items');
        } else {
            res.json(results);
        }
    });
});

// Get specific Gift
itemsRoutes.get('/items/:id', (req, res) => {
    const giftId = req.params.id
    connection.query('SELECT * FROM items LEFT JOIN reservations ON items.id = reservations.id_gift WHERE items.id = ?', [giftId], (err, results) => {
        if (err) {
            console.error('Error getting items:', err);
            res.status(500).send('Error getting items');
        } else {
            res.json(results);
        }
    });
});

// Get all items per user
itemsRoutes.get('/items/:type/user/:id', (req, res) => {
    const userId = req.params.id;
    const type = req.params.type
    connection.query("SELECT items.*, reservations.id as reservation_id, reservations.reservation_name as reservation_name FROM items LEFT JOIN reservations ON items.id = reservations.id_gift WHERE items.id_user_owner = ?", userId, (err, results) => {
        if (err) {
            console.error('Error getting items:', err);
            res.status(500).send('Error getting items');
        } else {
            res.json(results);
        }
    });
});

// Delete gift
itemsRoutes.delete('/items/:id', (req, res) => {

    const id = req.params.id

    // DELETING GIFT
    connection.query('DELETE FROM items WHERE items.id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting gift:', err);
            res.status(500).send('Error deleting gift');
        } else {
            // DELETING POTENTIAL RESERVATION
            connection.query('SELECT * FROM reservations WHERE reservations.id_gift = ?', id, (err, rows) => {
                if (err) {
                    console.error('Error checking existence of gift:', err);
                } else {
                    if (rows.length > 0) {
                        // La ligne existe, donc on peut effectuer la suppression
                        connection.query('DELETE FROM reservations WHERE reservations.id_gift = ?', id, (err, results) => {
                            if (err) {
                                console.error('Error deleting gift:', err);
                            }
                        });
                    }
                }
            });
            res.json(results);
        }
    });
});

// Add Gift
itemsRoutes.post('/items', (req, res) => {
    const {id, title, description, link, id_user_owner, price, image} = req.body;
    const date_creation = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const gift = {
        id: id,
        title: title,
        description: description,
        link: link,
        id_user_owner: id_user_owner,
        price: price,
        image: image,
        date_creation: date_creation,
        date_modification: null
    };

    connection.query('INSERT INTO items SET ?', gift, (err, result) => {
        if (err) {
            console.error('Error adding gift:', err);
            res.status(500).send('Error adding gift');
        } else {
            // Ajouter l'id généré au cadeau avant de renvoyer la réponse
            gift.id = result.insertId;
            res.json(gift);
        }
    });
});

// Update item
itemsRoutes.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const {title, description, link, price, image, id} = req.body;
    const date_modification = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const updatedGift = {
        title: title,
        description: description,
        link: link,
        date_modification: date_modification,
        price: price,
        image: image,
        id: id
    };

    connection.query('UPDATE items SET ? WHERE id = ?', [updatedGift, itemId], (err, result) => {
        if (err) {
            console.error('Error updating gift:', err);
            res.status(500).send('Error updating gift');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Item not found');
            } else {
                res.json(updatedGift);
            }
        }
    });
});

// Reserve item
itemsRoutes.post('/items/:item/reserve', (req, res) => {
    const itemID = req.params.item;
    const date_reservation = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const {email, user, itemTitle} = req.body;

    // UUID Creation for email
    const external_id = crypto.randomUUID()

    const reservation = {
        id: null,
        id_gift: itemID,
        reservation_name: user,
        date_reservation: date_reservation,
        external_id: external_id,
        email: email,
        itemTitle: itemTitle
    }

    const sendEmail = async (reservation) => {

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
                                Email: reservation.email,
                                Name: reservation.reservation_name
                            }
                        ],
                        TemplateID: 5090038,
                        TemplateLanguage: true,
                        Subject: `🐥 Cadeau de naissance ${reservation.itemTitle}`,
                        Variables: {
                            giftTitle: reservation.itemTitle,
                            cancelReservationUrl: `${process.env.APP_PUBLIC_URL}/delete-reservation/${reservation.external_id}`
                        }
                    }
                ]
            };

            try {
                const sendResult = await mailjet.post("send", { version: "v3.1" }).request(emailData)
                console.log('mail bien evoyé')
            } catch (err) {
                console.error(err.statusCode);
                throw err; // Vous pouvez gérer l'erreur en renvoyant une réponse d'erreur appropriée ici
            }

        })();


    };

    connection.query('INSERT INTO reservations SET id = ?, id_gift = ?, date_reservation = ?, reservation_name = ?, external_id = ?', [reservation.id,  reservation.id_gift, reservation.date_reservation, reservation.reservation_name, reservation.external_id], async (err, result) => {
        if (err) {
            console.error('Error adding reservation:', err);
            res.status(500).send('Error adding reservation');
        } else {
            reservation.id = result.insertId;
            await sendEmail(reservation);
            res.json(reservation);
        }
    });
});


// Delete reservation
itemsRoutes.delete('/reservation/:id', (req, res) => {
    const id = req.params.id
    connection.query('DELETE FROM reservations WHERE reservations.external_id = ?', id, (err, results) => {
        if (err) {
            console.error('Error deleting reservation:', err);
        } else {
            res.json(results);
        }
    });
});
