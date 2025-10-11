// src/components/chat/Message.jsx
import React, { useState } from 'react';
import dayjs from 'dayjs';

const Message = ({ message, isOwn, user, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className={`relative max-w-xs lg:max-w-md ${message.isCoverLetter ? 'max-w-2xl' : ''}`}>
        {message.isSystem ? (
          <div className="text-center text-sm text-gray-500 italic bg-gray-100 rounded-lg px-4 py-2">
            {message.text}
          </div>
        ) : message.isCoverLetter ? (
          // Design for cover letter
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-5 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="text-sm font-bold text-indigo-900">Application Proposal</h4>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap mb-3">{message.text}</p>
            {message.bid && (
              <div className="flex items-center gap-2 pt-3 border-t border-indigo-200">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-bold text-gray-900">
                  Proposed Bid: ${message.bid.toLocaleString()}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">
              {dayjs(message.timestamp).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
        ) : (
          <div className="relative group">
            <div
              className={`rounded-lg px-4 py-2 ${
                isOwn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  isOwn ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {dayjs(message.timestamp).format("h:mm A")}
              </p>
            </div>
            
            {/* Delete button - only shows on hover for own messages */}
            {isOwn && showDelete && onDelete && !message.isCoverLetter && (
              <button
                onClick={onDelete}
                className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all opacity-90 hover:opacity-100"
                title="Delete message from view"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;