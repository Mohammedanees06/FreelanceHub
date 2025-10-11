import Message from "../models/Message.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { emitToUser } from "../socket/socketHandler.js";

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, jobId, content } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!receiverId || !content) {
      return res.status(400).json({ 
        message: "Receiver and message content are required" 
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Prevent sending message to yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({ 
        message: "You cannot send a message to yourself" 
      });
    }

  
    if (jobId) {
      // Check if jobId is a valid MongoDB ObjectId format
      const isValidObjectId = /^[a-f\d]{24}$/i.test(jobId);
      if (isValidObjectId) {
        const job = await Job.findById(jobId);
        if (!job) {
          console.warn(`⚠️ Job ${jobId} not found, but allowing message`);
      
        }
      }
    }

    // Create message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      job: jobId || null,
      content,
    });

    // Populates sender and receiver details
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .populate("job", "title");

    // Get Socket.io instance and emit real-time event
    const io = req.app.get("io");
    if (io) {
      // Emit to receiver if online
      emitToUser(io, receiverId, "receive_message", {
        messageId: populatedMessage._id,
        senderId: senderId.toString(),
        senderName: req.user.name,
        content,
        jobId,
        job: populatedMessage.job,
        timestamp: populatedMessage.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("❌ Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .populate("job", "title")
      .sort({ createdAt: 1 }); // Oldest first

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("❌ Get Conversation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
export const getAllConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId =
        message.sender._id.toString() === currentUserId.toString()
          ? message.receiver._id.toString()
          : message.sender._id.toString();

      const partner =
        message.sender._id.toString() === currentUserId.toString()
          ? message.receiver
          : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (
        message.receiver._id.toString() === currentUserId.toString() &&
        !message.read
      ) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error(" Get Conversations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get messages for a specific job
// @route   GET /api/messages/job/:jobId
// @access  Private
export const getJobMessages = async (req, res) => {
  try {
    const { jobId } = req.params;
    const currentUserId = req.user._id;

   
    const job = await Job.findById(jobId);
    if (!job) {
      console.warn(`⚠️ Job ${jobId} not found, returning empty messages`);
      return res.json({
        success: true,
        count: 0,
        messages: [],
      });
    }

    // Get messages related to this job involving current user
    const messages = await Message.find({
      job: jobId,
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .populate("job", "title")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(" Get Job Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark message(s) as read
// @route   PUT /api/messages/read/:messageId
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    
    if (message.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: "You can only mark messages sent to you as read" 
      });
    }

    message.read = true;
    await message.save();

    // Emit real-time read receipt to sender
    const io = req.app.get("io");
    if (io) {
      emitToUser(io, message.sender.toString(), "message_read_receipt", {
        messageId: message._id,
        readBy: currentUserId.toString(),
        readAt: new Date(),
      });
    }

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error(" Mark As Read Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark all messages from a user as read
// @route   PUT /api/messages/read/user/:userId
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const result = await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        read: false,
      },
      {
        read: true,
      }
    );

    const io = req.app.get("io");
    if (io && result.modifiedCount > 0) {
      emitToUser(io, userId, "messages_read", {
        readBy: currentUserId.toString(),
        count: result.modifiedCount,
        readAt: new Date(),
      });
    }

    res.json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`,
    });
  } catch (error) {
    console.error(" Mark All As Read Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: "You can only delete messages you sent" 
      });
    }

    const receiverId = message.receiver.toString();
    await message.deleteOne();

    // Emit real-time notification to receiver
    const io = req.app.get("io");
    if (io) {
      emitToUser(io, receiverId, "message_deleted", {
        messageId,
        deletedBy: currentUserId.toString(),
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiver: currentUserId,
      read: false,
    });

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(" Get Unread Count Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};