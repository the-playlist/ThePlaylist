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

io.on("connection", (client) => {
  client.on("addSongToPlaylistApi", async (data) => {
    const { payload, handler } = data;
    const response = await fetch(
      "http://localhost:3000/api/playlist/addSongsToPlaylist",
      {
        method: "POST",
        body: payload,
      }
    );
    console.log("data", response.json());
  });
  client.on("message", (data) => {
    console.log("data==>", data);
  });
  client.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
