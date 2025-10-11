// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../api/messageApi";
import {
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
} from "../api/applicationApi";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

let socket;

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const isEmployer = user?.role === "employer";

  // Initializing socket with authentication
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !socket) {
      try {
        socket = io("http://localhost:5000", {
          auth: {
            token: token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          console.log("✅ Socket connected successfully");
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
        });

        socket.on("receive_message", (incomingMessage) => {
          console.log("📩 Received message via socket:", incomingMessage);

          const normalizedMessage = {
            _id:
              incomingMessage._id ||
              incomingMessage.messageId ||
              `temp_${Date.now()}`,
            sender: incomingMessage.sender?._id || incomingMessage.sender,
            receiver: incomingMessage.receiver?._id || incomingMessage.receiver,
            text: incomingMessage.content || incomingMessage.text,
            timestamp:
              incomingMessage.createdAt ||
              incomingMessage.timestamp ||
              new Date().toISOString(),
            isSystem: incomingMessage.isSystem || false,
          };

          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (msg) => msg._id === normalizedMessage._id
            );
            if (exists) {
              console.log(
                " Duplicate message detected, skipping:",
                normalizedMessage._id
              );
              return prevMessages;
            }
            console.log("✅ Adding new message to state:", normalizedMessage);
            return [...prevMessages, normalizedMessage];
          });
        });

        socket.on("message_delivered", (data) => {
          console.log("✓ Message delivered:", data.messageId);
        });

        socket.on("message_read", (data) => {
          console.log("✓✓ Message read:", data.messageId);
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
        socket.off("message_delivered");
        socket.off("message_read");
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Fetch applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch applications
        let appData = [];
        if (isEmployer) {
          const empResponse = await getEmployerApplications();
          appData = Array.isArray(empResponse)
            ? empResponse
            : empResponse?.applications || [];
        } else {
          const freelancerResponse = await getMyApplications();
          appData = Array.isArray(freelancerResponse)
            ? freelancerResponse
            : freelancerResponse?.applications || [];
        }

        setApplications(appData);

        // Auto-selects first application
        if (appData.length > 0) {
          setSelectedApplication(appData[0]._id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEmployer]);

  // Fetch messages when application is selected

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedApplication) {
        setMessages([]);
        return;
      }

      try {
        let messagesData = [];

        const app = applications.find((a) => a._id === selectedApplication);
        if (!app) {
          console.error("Application not found");
          setMessages([]);
          return;
        }

        // Extract jobId
        const jobId = app.jobId || app.job?._id || app.job;

        if (!jobId) {
          console.error("Job ID not found in application:", app);
          setMessages([]);
          return;
        }

        console.log(" Fetching messages for job:", jobId);

        const response = await fetch(
          `http://localhost:5000/api/messages/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        messagesData = data.messages || [];

        // Normalize message structure
        const normalizedMessages = messagesData.map((msg) => ({
          _id: msg._id,
          sender: msg.sender?._id || msg.sender,
          receiver: msg.receiver?._id || msg.receiver,
          text: msg.content || msg.text,
          timestamp: msg.createdAt || msg.timestamp,
          isSystem: msg.isSystem || false,
        }));

        // Add cover letter/proposal as the first message
        const coverLetter = app.proposal || app.coverLetter;
        const freelancerId =
          app.freelancerId || app.freelancer?._id || app.applicant?._id;

        if (coverLetter) {
          const coverLetterMessage = {
            _id: `application_${app._id}`,
            sender: freelancerId,
            receiver: app.employerId || app.employer?._id,
            text: coverLetter,
            timestamp: app.appliedAt || app.createdAt,
            isSystem: false,
            isCoverLetter: true,
            bid: app.proposedRate || app.bid,
          };

          // Add cover letter as first message
          normalizedMessages.unshift(coverLetterMessage);
        }

        setMessages(normalizedMessages);
        scrollToBottom();

        // Join the conversation room
        if (socket && socket.connected) {
          socket.emit("join_conversation", {
            conversationId: selectedApplication,
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();

    return () => {
      if (socket && socket.connected && selectedApplication) {
        socket.emit("leave_conversation", {
          conversationId: selectedApplication,
        });
      }
    };
  }, [selectedApplication, applications]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getReceiverId = () => {
    const app = applications.find((a) => a._id === selectedApplication);

    if (!app) {
      console.error(" Application not found:", selectedApplication);
      return null;
    }

    const receiverId = isEmployer ? app.freelancerId : app.employerId;
    return receiverId;
  };
  const handleDeleteMessage = (messageId) => {
    if (
      window.confirm(
        "Delete this message from your view? (It will still be visible to others)"
      )
    ) {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }
  };
  const handleSend = async () => {
    const receiverId = getReceiverId();

    if (!text.trim() || !selectedApplication) {
      console.warn("⚠️ Missing text or application ID");
      return;
    }

    if (!receiverId) {
      console.error(" Cannot send message: Receiver ID not found");
      alert("Cannot send message. Please refresh the page and try again.");
      return;
    }

    // Get's the actual jobId
    const app = applications.find((a) => a._id === selectedApplication);
    const actualJobId = app?.jobId || app?.job?._id || app?.job;

    const messagePayload = {
      receiverId: receiverId,
      content: text,
      jobId: actualJobId,
    };

    if (!messagePayload.jobId) {
      delete messagePayload.jobId;
    }

    console.log(
      "📤 Sending message payload:",
      JSON.stringify(messagePayload, null, 2)
    );

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      sender: user._id,
      receiver: receiverId,
      text: text,
      timestamp: new Date().toISOString(),
      isSystem: false,
      isPending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");
    scrollToBottom();

    try {
      const response = await sendMessage(messagePayload);

      const savedMessage = response.data || response;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? {
                _id: savedMessage._id || tempId,
                sender: user._id,
                receiver: receiverId,
                text: text,
                timestamp: savedMessage.createdAt || new Date().toISOString(),
                isSystem: false,
                isPending: false,
              }
            : msg
        )
      );

      if (socket && socket.connected) {
        socket.emit("send_message", {
          conversationId: selectedApplication,
          receiverId: receiverId,
          content: text,
          jobId: actualJobId,
          messageId: savedMessage._id,
        });
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      setText(text);
      alert(
        `Failed to send message: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleUpdateApplicationStatus = async (status) => {
    if (!selectedApplication) return;

    try {
      await updateApplicationStatus(selectedApplication, status);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === selectedApplication ? { ...app, status } : app
        )
      );

      const statusMessage = {
        _id: `status_${Date.now()}`,
        text: `Application status updated to: ${status}`,
        sender: user?._id,
        timestamp: new Date().toISOString(),
        isSystem: true,
      };

      const payload = {
        receiverId: getReceiverId(),
        content: statusMessage.text,
        jobId: selectedApplication,
        isSystem: true,
      };

      await sendMessage(payload);
      setMessages((prev) => [...prev, statusMessage]);

      if (socket && socket.connected) {
        socket.emit("send_message", {
          ...payload,
          conversationId: selectedApplication,
        });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleSelectApplication = (id) => {
    setSelectedApplication(id);
  };

  const getApplicationTitle = (app) => {
    let jobTitle = app.jobTitle || app.job?.title || "Job";
    let personName = "";

    if (isEmployer) {
      personName =
        app.freelancerName ||
        app.freelancer?.name ||
        app.applicant?.name ||
        "Freelancer";
    } else {
      personName =
        app.employerName ||
        app.employer?.name ||
        app.job?.employer?.name ||
        "Employer";
    }

    return `${jobTitle} - ${personName}`;
  };

  const getChatTitle = () => {
    const app = applications.find((a) => a._id === selectedApplication);
    return app ? getApplicationTitle(app) : "Select an application";
  };

  const getChatSubtitle = () => {
    if (selectedApplication) {
      const app = applications.find((a) => a._id === selectedApplication);
      return app?.status;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto m-6 h-[700px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto m-6 flex gap-4 h-[700px]">
      <Sidebar
        applications={applications}
        selectedId={selectedApplication}
        onSelectApplication={handleSelectApplication}
        isEmployer={isEmployer}
      />

      <ChatWindow
        messages={messages}
        selectedId={selectedApplication}
        text={text}
        setText={setText}
        onSend={handleSend}
        onDeleteMessage={handleDeleteMessage}
        user={user}
        title={getChatTitle()}
        subtitle={getChatSubtitle()}
        isEmployer={isEmployer}
        onUpdateStatus={handleUpdateApplicationStatus}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default ChatPage;
