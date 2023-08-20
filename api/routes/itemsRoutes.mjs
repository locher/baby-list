import express from 'express';
import { connection } from "../connection.mjs";

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
                            } else {
                                res.json(results);
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
    const { id, title, description, link, id_user_owner, type } = req.body;
    const date_creation = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const gift = {
        id: id,
        title: title,
        description: description,
        link: link,
        id_user_owner: id_user_owner,
        date_creation: date_creation,
        date_modification: null,
        type: type
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
    const { title, description, link, type } = req.body;
    const date_modification = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const updatedGift = {
        title: title,
        description: description,
        link: link,
        date_modification: date_modification,
        type: type
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
itemsRoutes.post('/items/:item/reserve/:user', (req, res) => {
    const itemID = req.params.item;
    const userID = req.params.user;
    const date_reservation = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const reservationId = req.body.reservation_id

    console.log(req.body)

    const reservation = {
        id: reservationId,
        id_gift: itemID,
        id_user_reservation: userID,
        date_reservation: date_reservation
    }

    connection.query('INSERT INTO reservations SET ?', reservation, (err, result) => {
        if (err) {
            console.error('Error adding reservation:', err);
            res.status(500).send('Error adding gift');
        } else {
            reservation.id = result.insertId;
            res.json(reservation);
        }
    });
});



// Delete reservation
itemsRoutes.delete('/reservation/:id', (req, res) => {
    const id = req.params.id
    connection.query('DELETE FROM reservations WHERE reservations.id = ?', id, (err, results) => {
        if (err) {
            console.error('Error deleting reservation:', err);
        } else {
            res.json(results);
        }
    });
});