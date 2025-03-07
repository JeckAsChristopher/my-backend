const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Allow CORS for frontend communication
app.use(cors({ origin: "*" }));

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let messages = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send chat history
    socket.emit("history", messages);

    // Handle messages
    socket.on("message", (data) => {
        const now = new Date();
        const timestamp = now.toLocaleString("en-US", { timeZone: "Asia/Manila" });

        const newMessage = { sender: data.sender, text: data.text, time: timestamp };
        messages.push(newMessage);
        io.emit("message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// ✅ Redirect all unknown routes to `index.html`
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Listen on port 3000 (or Render's port)
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});