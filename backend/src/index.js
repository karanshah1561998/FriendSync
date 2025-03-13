import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";
import { app, server } from "./lib/socket.js";
import passport from "passport";
import session from "express-session";
import "./lib/passport.js"; // Ensure Passport is initialized
import { CONFIG } from "./lib/config.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173", "https://localhost:5173", CONFIG.CLIENT_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET, // Used to sign the session ID cookie
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure:CONFIG.ISPRODUCTION, // Secure in production
            httpOnly: true, // Prevent XSS attacks
            sameSite: "lax", // Prevent CSRF
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (CONFIG.ISPRODUCTION) {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
});