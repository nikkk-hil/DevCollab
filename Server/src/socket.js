import { Server } from "socket.io";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join:board", (boardId) => {
      console.log(`Socket ${socket.id} joined board ${boardId}`);
      socket.join(boardId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket is not initialized");
  return io;
};

export { initSocket, getIO };
