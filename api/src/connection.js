import mysql from 'mysql'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const connection = mysql.createConnection({
    host: process.env.API_BDD_HOST,
    port: process.env.API_BDD_PORT,
    user: process.env.API_BDD_USER,
    password: process.env.API_BDD_PASSWORD,
    database: process.env.API_BDD_DATABASE
});

