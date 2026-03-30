import { useState } from "react";
import axios from "axios";

export default function Chat() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message) return;

    const token = localStorage.getItem("token");

    // add user message
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
  <div className="p-6 bg-gray-100 w-[350px]  flex justify-center">

    {/* Chat Card */}
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow flex flex-col h-[60vh]">

      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-lg font-semibold">AI Assistant 🤖</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">

        {chat.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            Ask me anything about your habits...
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
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      {/* Input Section */}
      <div className="p-4 border-t flex gap-2 bg-white">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me anything..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>

      </div>

    </div>

  </div>
);
}