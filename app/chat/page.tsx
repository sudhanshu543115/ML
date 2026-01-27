"use client";

import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "@/api/Allapi";
import api from "@/api/axios";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSendMessage = async () => {
    if (!text.trim() || !chatId) return;

    try {
      const response = await sendMessage(chatId, text);
      setMessages((prev) => [...prev, response.message]);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

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
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m._id}>{m.text}</div>
        ))}
      </div>

      <div className="p-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
