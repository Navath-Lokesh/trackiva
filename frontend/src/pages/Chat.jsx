import { useState } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/chat",
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
    <div className=" bg-gray-900 flex justify-center">

      {/* Chat Card */}
      <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-2xl shadow flex flex-col h-[57vh]">

        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">
            AI Assistant 🤖
          </h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">

          {chat.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Ask me anything about your habits... <br />
              Page is still in developing stage....
            </p>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
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

        {/* Input Section */}
        <div className="p-4 border-t border-gray-700 flex gap-2 bg-gray-800">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Ask me anything..."
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 rounded-lg"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}