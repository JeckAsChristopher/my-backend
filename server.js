const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const filter = new Filter();
let messages = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send chat history
    socket.emit("history", messages);

    // Check for bad words
    socket.on("checkBadWords", (text, callback) => {
        const filteredText = filter.clean(text).replace(/\w/g, "#");
        callback(filteredText);
    });

    // Handle messages
    socket.on("message", (data) => {
        const now = new Date();
        const timestamp = now.toLocaleString("en-US", { timeZone: "Asia/Manila" });

        const newMessage = { sender: data.sender, text: data.text, time: timestamp };
        messages.push(newMessage);
        io.emit("message", newMessage);
    });

    // Handle request event
    socket.on("request", (data) => {
        console.log("Received request:", data.request);
        
        // Simulate request processing delay
        setTimeout(() => {
            socket.emit("requestReceived");
        }, 1000);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Listen on port 3000 (use 0.0.0.0 for Render deployment)
server.listen(3000, () => {
    console.log("Server running on port 3000");
});