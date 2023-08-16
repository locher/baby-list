import express from 'express';
import { connection } from "../connection.mjs";

export const usersRoutes = express.Router();

// All users
usersRoutes.get('/users', (req, res) => {

    let queryParam

    // If Parameters
    if(Object.keys(req.query).length > 0){

        queryParam = []

        // Exclude children
        const excludeChildren = req.query?.children
        if(excludeChildren && excludeChildren === "0"){
            queryParam.push('is_child_account = 0')
        }

        // Exclude user
        const IdtoExclude = req.query?.exclude

        if(IdtoExclude){
            queryParam.push(`id NOT IN (${IdtoExclude})`)
        }

        // Format queries
        queryParam = 'WHERE ' + queryParam.join(' AND ')
    }

    connection.query(`SELECT * FROM users ${queryParam}`, (err, results) => {
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


// Add User
usersRoutes.post('/user', (req, res) => {
    const { id, name, picture_id, is_child_account, birthday_date, size_top, size_bottom, size_feet, parent } = req.body;
    const date_creation = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const formatted_birthday = birthday_date.slice(0, 19).replace('T', ' ')

    const user = {
        id: id,
        name: name,
        picture_id: picture_id,
        is_child_account: is_child_account || 0,
        birthday_date: formatted_birthday,
        size_top: size_top,
        size_bottom: size_bottom,
        size_feet: size_feet,
        date_creation: date_creation
    };

    connection.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            res.status(500).send('Error adding user');
        } else {
            // Ajouter l'id généré au user avant de renvoyer la réponse
            user.id = result.insertId;
        }

        // Si y a des parents
        if (user.id && user.is_child_account && parent.length > 0){

            parent.forEach((elt) => {

                const relation = {
                    id: null,
                    id_child: user.id,
                    id_parent: elt
                }

                connection.query('INSERT INTO user_relations SET ?', relation, (err, result) => {
                    if (err) {
                        console.error('Error adding relation:', err);
                        res.status(500).send('Error adding gift');
                    }
                });
            })

            res.json(user);
        }
    });

});