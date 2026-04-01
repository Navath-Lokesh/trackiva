import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left */}
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} Trackiva. All rights reserved.
        </div>

        {/* Center Links */}
        {/* <div className="flex gap-6 text-sm text-gray-700">
          <a href="/dashboard" className="hover:text-green-600">
            Dashboard
          </a>
          <a href="/habits" className="hover:text-green-600">
            Habits
          </a>
          <a href="/analytics" className="hover:text-green-600">
            Analytics
          </a>
        </div> */}

        {/* Right (Support Email) */}
        <div className="text-sm text-gray-600">
          Need help?{" "}
          <a
            href="mailto:trackiva.app@gmail.com"
            className="text-green-600 hover:underline"
          >
            trackiva.app@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;