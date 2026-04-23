import { useState } from "react";
import axios from "axios";
import API from "../api/Main_url"; 

export default function Chat() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const token = localStorage.getItem("token");

    const newChat = [...chat, { type: "user", text: message }];
    setChat(newChat);

    setMessage("");

    try {
      const res = await axios.post(
        `${API}/api/chat`, // ✅ FIXED
        { message },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setChat([
        ...newChat,
        { type: "ai", text: res.data.reply }
      ]);

    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="w-full">

    <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl shadow flex flex-col h-[400px] sm:h-[450px]">

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-sm sm:text-base font-semibold text-white">
          AI Assistant 🤖
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-900">

        {chat.length === 0 && (
          <p className="text-gray-400 text-center mt-6 text-sm">
            Ask me anything about your habits... <br />
            <span className="text-xs">Feature coming soon 🚀</span>
          </p>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[75%] text-xs sm:text-sm ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 flex gap-2 bg-gray-800">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg outline-none placeholder-gray-400 text-sm"
          placeholder="Ask something..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg text-sm"
        >
          Send
        </button>

      </div>

    </div>

  </div>
);
}