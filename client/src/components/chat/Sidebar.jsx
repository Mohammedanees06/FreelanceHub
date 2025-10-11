// src/components/chat/Sidebar.jsx
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Sidebar = ({
  applications = [],
  selectedId,
  onSelectApplication,
  isEmployer,
}) => {
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

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Messages ({applications.length})
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isEmployer ? "Chat with applicants" : "Chat with employers"}
        </p>
      </div>

      {/* Applications List */}
      <div className="flex-grow overflow-y-auto">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-center text-gray-400">No conversations yet</p>
            <p className="text-center text-gray-400 text-sm mt-2">
              {isEmployer
                ? "Applications will appear here"
                : "Apply to jobs to start conversations"}
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              onClick={() => onSelectApplication(app._id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedId === app._id
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {getApplicationTitle(app)}
                  </h3>

                  <div className="flex items-center mt-2 gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status || "pending"}
                    </span>
                    {(app.proposedRate || app.bid) && (
                      <span className="text-xs font-semibold text-gray-700">
                        Bid: ${(app.proposedRate || app.bid).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-2">
                  <span className="text-xs text-gray-400">
                    {app.appliedAt || app.createdAt
                      ? dayjs(app.appliedAt || app.createdAt).fromNow()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
