const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const server = http.createServer();

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("addSongToPlaylistApi", (data) => {
    io.emit("addSongToPlaylistApiResponse", data);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
