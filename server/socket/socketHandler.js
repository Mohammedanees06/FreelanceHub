import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Store online users: Map of userId -> socketId
const onlineUsers = new Map();

export const initializeSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);

    socket.broadcast.emit("user_online", {
      userId: socket.userId,
      name: socket.user.name,
    });

    // Send list of online users to the newly connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit("online_users", onlineUsersList);

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle sending messages
    socket.on("send_message", async (data) => {
      const { receiverId, content, jobId, messageId } = data;
      
      // Validate input
      if (!receiverId || !content) {
        socket.emit("error", { message: "Missing required fields" });
        return;
      }
      
      // Emit to receiver if they're online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          messageId: messageId || `msg_${Date.now()}`,
          senderId: socket.userId,
          senderName: socket.user.name,
          content,
          jobId,
          timestamp: new Date(),
        });
      }
      
      // Also emit to sender for confirmation
      socket.emit("message_sent", {
        messageId: messageId || `msg_${Date.now()}`,
        receiverId,
        timestamp: new Date(),
        delivered: !!receiverSocketId, // Indicate if user was online
      });
    });

    // Handle typing indicator
    socket.on("typing_start", (data) => {
      const { receiverId } = data;
      
      if (!receiverId) return;
      
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          userId: socket.userId,
          userName: socket.user.name,
        });
      }
    });

    socket.on("typing_stop", (data) => {
      const { receiverId } = data;
      
      if (!receiverId) return;
      
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stopped_typing", {
          userId: socket.userId,
        });
      }
    });

    // Handle message read receipts
    socket.on("message_read", (data) => {
      const { messageId, senderId } = data;
      
      if (!messageId || !senderId) return;
      
      const senderSocketId = onlineUsers.get(senderId);
      
      if (senderSocketId) {
        io.to(senderSocketId).emit("message_read_receipt", {
          messageId,
          readBy: socket.userId,
          readByName: socket.user.name,
          readAt: new Date(),
        });
      }
    });

    // Handle joining a conversation room
    socket.on("join_conversation", (data) => {
      const { userId } = data;
      
      if (!userId) return;
      
      const roomId = [socket.userId, userId].sort().join("-");
      socket.join(roomId);
      console.log(`User ${socket.userId} joined conversation room: ${roomId}`);
    });

    // Handle leaving a conversation room
    socket.on("leave_conversation", (data) => {
      const { userId } = data;
      
      if (!userId) return;
      
      const roomId = [socket.userId, userId].sort().join("-");
      socket.leave(roomId);
      console.log(`User ${socket.userId} left conversation room: ${roomId}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      
      // Remove user from online users
      onlineUsers.delete(socket.userId);
      
      // Broadcast to all users that this user is offline
      io.emit("user_offline", {
        userId: socket.userId,
        name: socket.user.name,
      });
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

// Helper function to get online users (can be used in other files)
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

// Helper function to check if user is online
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

// Helper function to emit to specific user
export const emitToUser = (io, userId, event, data) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};