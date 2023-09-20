import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'

import { connection } from "./connection.mjs";
import { usersRoutes } from './routes/usersRoutes.mjs';
import { itemsRoutes } from './routes/itemsRoutes.mjs';

dotenv.config({ path: '.env' })

const app = express();

const corsOptions = {
    origin: [process.env.APP_PUBLIC_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};


app.use(bodyParser.json());
app.use(cors(corsOptions));

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
