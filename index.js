require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors);

const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL;

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log("User", data.username, "joined the room", data.room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnected", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("server is running on port", PORT);
  console.log("allowed client url is: ", CLIENT_URL);
});
