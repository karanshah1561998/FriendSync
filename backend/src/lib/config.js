import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const CONFIG = {
    SERVER_URL: isProduction ? process.env.PROD_SERVER_URL : process.env.DEV_SERVER_URL,
    CLIENT_URL: isProduction ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL,
    ISPRODUCTION: isProduction
};
