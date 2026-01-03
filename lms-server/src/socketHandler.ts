import { Server as SocketIOServer, Socket } from "socket.io";
import MessageModel from "./models/Message.js";

export const initializeSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Join a specific batch room
    socket.on("join_chat", (data: { batchId: string; user: any }) => {
      const { batchId, user } = data;
      if (!batchId) return;

      socket.join(`batch_${batchId}`);
      console.log(`User ${user?.name || socket.id} joined batch_${batchId}`);
    });

    // Handle sending messages
    socket.on(
      "send_message",
      async (data: {
        batchId: string;
        content: string;
        senderId: string;
        senderModel: "Student" | "Trainer" | "Admin";
        senderName: string;
        type?: "text" | "image" | "file";
        fileUrl?: string;
      }) => {
        try {
          const {
            batchId,
            content,
            senderId,
            senderModel,
            senderName,
            type,
            fileUrl,
          } = data;

          // Save to MongoDB
          const newMessage = await MessageModel.create({
            batchId,
            content,
            senderId,
            senderModel,
            senderName,
            type: type || "text",
            fileUrl,
          });

          // Broadcast to everyone in the room
          io.in(`batch_${batchId}`).emit("receive_message", newMessage);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
