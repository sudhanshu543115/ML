"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFriendsList, createChat } from "@/api/Allapi";
import { MessageCircle, User, Clock } from "lucide-react";

interface Friend {
  _id: string;
  name: string;
  email: string;
  skillsTeach: string[];
  skillsLearn: string[];
}

export default function ChatListPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriendsList();
        setFriends(response.friends || []);
      } catch (err: any) {
        setError(err.message || "Failed to load friends");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleChatClick = async (friendId: string) => {
    try {
      const response = await createChat(friendId);
      router.push(`/chat/${response.chat._id}`);
    } catch (err: any) {
      console.error("Failed to create chat:", err);
      // Fallback: navigate directly with friend ID
      router.push(`/chat/${friendId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading friends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          </div>
          <p className="text-gray-500 mt-1">Chat with your connections</p>
        </div>
      </div>

      {/* Friends List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {friends.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
            <p className="text-gray-500 mb-4">
              Start connecting with people to begin chatting!
            </p>
            <Link
              href="/matches"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => handleChatClick(friend._id)}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-100 hover:border-indigo-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-lg">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Friend Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                    
                    {/* Skills Preview */}
                    {friend.skillsTeach.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {friend.skillsTeach.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {friend.skillsTeach.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{friend.skillsTeach.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Icon */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Chat</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
