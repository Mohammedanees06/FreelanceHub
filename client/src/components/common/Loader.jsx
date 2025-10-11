import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }}></div>
        <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }}></div>
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default Loader;