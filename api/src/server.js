import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'

import { connection } from "./connection.js";
import { usersRoutes } from './routes/usersRoutes.js';
import { itemsRoutes } from './routes/itemsRoutes.js';
import {loginRoute} from "./routes/loginRoute.js";

dotenv.config({ path: '.env' })

const app = express();

const corsOptions = {
    origin: [process.env.APP_PUBLIC_URL, 'http://localhost'],
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
app.use([usersRoutes, itemsRoutes, loginRoute]);

const port = process.env.API_SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
