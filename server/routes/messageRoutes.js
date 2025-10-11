import express from "express";
import {
  sendMessage,
  getConversation,
  getAllConversations,
  getJobMessages,
  markAsRead,
  markAllAsRead,
  deleteMessage,
  getUnreadCount,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a message
router.post("/", protect, sendMessage);

// Get all conversations for current user
router.get("/conversations", protect, getAllConversations);

// Get unread message count
router.get("/unread/count", protect, getUnreadCount);

// Get conversation with a specific user
router.get("/conversation/:userId", protect, getConversation);

// Get messages for a specific job
router.get("/job/:jobId", protect, getJobMessages);

// Mark a message as read
router.put("/read/:messageId", protect, markAsRead);

// Mark all messages from a user as read
router.put("/read/user/:userId", protect, markAllAsRead);

// Delete a message
router.delete("/:messageId", protect, deleteMessage);

export default router;