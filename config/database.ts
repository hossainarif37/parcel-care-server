import mongoose from "mongoose";
import colors from 'colors';
import 'dotenv/config';

const dbConnectionUrl = process.env.DB_CONNECTION_URL;

if (!dbConnectionUrl) {
    console.error(colors.red('Error: DB_CONNECTION_URL is not defined in the environment variables.'));
    process.exit(1);
}

mongoose
    .connect(dbConnectionUrl)
    .then(() => {
        console.log(colors.blue('Database Connected'));
    })
    .catch((error: any) => {
        console.log((error as Error).message);
    });