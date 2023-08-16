import express from 'express';
import bodyParser from 'body-parser';
import { connection } from "./connection.mjs";
import { usersRoutes } from './routes/usersRoutes.mjs';
import { itemsRoutes } from './routes/itemsRoutes.mjs';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const app = express();

app.use(bodyParser.json());
app.use(cors());

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database!');
    }
});

// Import des routes
app.use([usersRoutes, itemsRoutes]);

const port = process.env.API_SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});