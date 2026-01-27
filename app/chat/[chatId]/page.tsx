"use client";

import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "@/api/Allapi";
import { io } from "socket.io-client";
import socket from "@/src/lib/socket";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  createdAt: string;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id;
  };
  


useEffect(() => {
    // For now, let's focus on REST API functionality
    // We'll add real-time socket later
    
    return () => {
      // Cleanup if needed
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;
    
    const userId = getCurrentUserId();
    console.log('Sending message via REST API:', { chatId, senderId: userId, text });
    
    try {
      const response = await sendMessage(chatId, text);
      console.log('Message sent successfully:', response);
      setMessages(prev => [...prev, response.message]);
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };







  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!chatId) {
          console.error("Chat ID is undefined");
          setIsLoading(false);
          return;
        }
        const response = await getMessages(chatId);
        setMessages(response.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Invalid chat ID</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <p className="text-sm text-gray-500">Chat ID: {chatId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="font-medium text-sm text-gray-700">
                  {m.sender?.name || "Unknown"}
                </p>
                <p className="text-gray-900 mt-1">{m.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
