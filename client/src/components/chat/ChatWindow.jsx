// src/components/chat/ChatWindow.jsx
import Message from "./Message";

const ChatWindow = ({
  messages = [],
  selectedId,
  text,
  setText,
  onSend,
  onDeleteMessage, // Add this prop
  user,
  title,
  subtitle,
  isEmployer,
  onUpdateStatus,
  messagesEndRef,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Only show status buttons if application is still pending
  const showStatusButtons = selectedId && isEmployer && subtitle === "pending";

  return (
    <div className="flex-1 bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <span
              className={`text-sm mt-1 px-2 py-1 rounded-full inline-block ${getStatusColor(
                subtitle
              )}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto space-y-4 px-4 py-2 bg-gray-50">
        {!selectedId ? (
          <p className="text-center text-gray-400 mt-10">
            Select a conversation to start messaging
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isSenderMe =
              msg.sender === user?._id ||
              msg.sender?._id === user?._id ||
              msg.sender === "me";
            return (
              <Message 
                key={idx} 
                message={msg} 
                isOwn={isSenderMe} 
                user={user}
                onDelete={() => onDeleteMessage(msg._id)} // Pass delete handler
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Application Status Buttons (Employer Only - Only for Pending Applications) */}
      {showStatusButtons && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2 font-medium">Update Application Status:</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onUpdateStatus("shortlisted")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              Shortlist
            </button>
            <button
              onClick={() => onUpdateStatus("accepted")}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdateStatus("rejected")}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdateStatus("hired")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              Hire
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={
              selectedId
                ? "Type your message..."
                : "Select a conversation first"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedId}
            className="flex-grow border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={onSend}
            disabled={!selectedId || !text.trim()}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-full font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;