const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Filter = require("bad-words"); // ✅ Correct CommonJS import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const filter = new Filter(); // ✅ No TypeError

let messages = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send chat history
    socket.emit("history", messages);

    // Handle messages
    socket.on("message", (data) => {
        const now = new Date();
        const timestamp = now.toLocaleString("en-US", { timeZone: "Asia/Manila" });

socket.on("checkBadWords", (text, callback) => {
    const filteredText = filter.clean(text).replace(/\w/g, "#"); // Replace bad words with `#`
    callback(filteredText);
});

        const newMessage = { sender: data.sender, text: data.text, time: timestamp };
        messages.push(newMessage);
        io.emit("message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("request", (data) => {
        console.log("Received request:", data.request);

        // Simulate request processing delay
        setTimeout(() => {
            socket.emit("requestReceived"); // Notify client that request was received
        }, 1000); // Ensure it responds within 2 seconds
    });

});
});

// Listen on Local Network
server.listen(3000, "192.168.100.6", () => {
    console.log("Server running on http://192.168.100.6:3000");
});