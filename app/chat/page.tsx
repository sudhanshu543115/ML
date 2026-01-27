"use client";

import { JSX, useState } from "react";

interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
}

interface ChatUser {
  id: string;
  name: string;
}

export default function ChatPage(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>({
    id: "1",
    name: "Sudhanshu",
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "other",
      text: "Hey! I saw we matched for React ↔ ML",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Yes! I'd love to learn ML from you.",
      time: "10:32 AM",
    },
  ]);

  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => setSelectedUser({ id: "1", name: "Sudhanshu" })}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b"
          >
            <p className="font-medium">Sudhanshu</p>
            <p className="text-sm text-gray-500 truncate">
              React ↔ ML
            </p>
          </button>
        </div>
      </aside>

      {/* ================= CHAT WINDOW ================= */}
      <main className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {selectedUser?.name.charAt(0)}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{selectedUser?.name}</h3>
            <p className="text-sm text-gray-500">Skill match</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "me"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800 border"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-[10px] mt-1 opacity-70 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t px-4 py-3 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
