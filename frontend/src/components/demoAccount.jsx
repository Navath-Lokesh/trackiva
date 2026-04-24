import React from "react";

const DemoAccount = ({ onDemoLogin }) => {
  return (
    <div className="mt-5 p-4 rounded-xl bg-gray-800 text-white text-center shadow-lg">
      
      <h3 className="text-lg font-semibold mb-2">
        🚀 Try Demo Account
      </h3>

      <div className="text-sm text-gray-300 mb-3">
        <p>
          <span className="font-medium text-white">Email:</span>{" "}
          demo@trackiva.com
        </p>
        <p>
          <span className="font-medium text-white">Password:</span>{" "}
          demo123
        </p>
      </div>
{/* 
      <button
        onClick={onDemoLogin}
        className="w-full bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold py-2 rounded-lg"
      >
        Login as Demo User
      </button> */}

      <p className="text-xs text-red-400 mt-2">
        Note: This demo account has limited access and preloaded data.
      </p>
      
    </div>
  );
};

export default DemoAccount;