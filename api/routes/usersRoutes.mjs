import express from 'express';
import { connection } from "../connection.mjs";

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