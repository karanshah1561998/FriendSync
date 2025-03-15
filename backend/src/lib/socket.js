import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;

        // Emit updated online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", { senderId });
        }
    });


    socket.on("disconnect", async () => {
        if (userId) {
            delete userSocketMap[userId];

            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

            io.emit("getOnlineUsers", Object.keys(userSocketMap));
            io.emit("userDisconnected", { userId, lastSeen: new Date() });
        }
    });
});

export { io, app, server };