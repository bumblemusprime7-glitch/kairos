// server setup
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { Server } = require("socket.io");

const PORT = process.env.PORT || 80;
const basePath = process.env.BASE_PATH || "";

const io = new Server(server, { path: `${basePath}/socket.io` });

// serve client
app.use(express.static("frontend"));

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // disconnect
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

// start server
server.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}`);
});
