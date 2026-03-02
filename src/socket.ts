import http from "http";
import { app } from ".";
import { Server } from "socket.io";
import logger from "./utils/logger";

const server = http.createServer(app);

const socketIo = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

socketIo.on("connection", (socket) => {
  logger.info(`A user connected ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`User disconnected ${socket.id}`);
  });

  socket.on("join-room", (roomId) => {
    logger.info(`User ${socket.id} joining room ${roomId}`);
    socket.join(roomId);
    // Notify others in the room that a new user has joined
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ roomId, offer }) => {
    logger.info(`Relaying offer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    logger.info(`Relaying answer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    logger.info(`Relaying ICE candidate from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit("ice-candidate", candidate);
  });
});

export { server, socketIo };
