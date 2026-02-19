import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"], // MATCHING FRONTEND
    allowEIO3: true, // For broader compatibility
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const user = await User.findOne({ clerkId: session.sub });
      if (!user) return next(new Error("User not found"));

      socket.data.userId = user._id.toString();
      next();
    } catch (error: any) {
      console.error("Handshake Auth Error:", error.message);
      next(new Error("Auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    onlineUsers.set(userId, socket.id);

    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });
    socket.broadcast.emit("user-online", { userId });
    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          // Persist to MongoDB
          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
            lastMessageAt: new Date(),
          });

          const populatedMessage = await message.populate(
            "sender",
            "name avatar",
          );

          // Broadcast to chat room
          io.to(`chat:${chatId}`).emit("new-message", populatedMessage);

          // Also send to users room for chat list updates
          const chat = await Chat.findById(chatId);
          chat?.participants.forEach((p) => {
            io.to(`user:${p}`).emit("new-message", populatedMessage);
          });
        } catch (error) {
          socket.emit("socket-error", { message: "Failed to send message" });
        }
      },
    );

    socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
      const typingPayload = {
        userId,
        chatId: data.chatId,
        isTyping: data.isTyping,
      };
      socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);

      const chat = await Chat.findById(data.chatId);
      if (chat) {
        const other = chat.participants.find((p) => p.toString() !== userId);
        if (other) socket.to(`user:${other}`).emit("typing", typingPayload);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
};
