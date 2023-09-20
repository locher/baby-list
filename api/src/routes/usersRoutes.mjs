import express from 'express';
import { connection } from "../connection.mjs";
import {itemsRoutes} from "./itemsRoutes.mjs";

export const usersRoutes = express.Router();

// All users
usersRoutes.get('/users', (req, res) => {

    connection.query(`SELECT * FROM users`, (err, results) => {
        if (err) {
            console.error('Error getting users:', err);
            res.status(500).send('Error getting users');
        } else {
            res.json(results);
        }
    });

});

// Specific user
usersRoutes.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM users WHERE users.id = ?', userId, (err, results) => {
        if (err) {
            console.error('Error getting gifts:', err);
            res.status(500).send('Error getting gifts');
        } else {
            res.json(results);
        }
    });
});

// Update item
itemsRoutes.put('/user/:id', (req, res) => {
    const id = req.params.id
    const { description, birthdayDate } = req.body

    console.log(description, birthdayDate)

    connection.query('UPDATE users SET description = ?, birthday_date = ? WHERE id = ?', [description, birthdayDate, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Item not found');
            } else {
                res.json('ok');
            }
        }
    });
});
