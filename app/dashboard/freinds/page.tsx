"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFriendsList, createChat } from "@/api/Allapi";

interface Friend {
  _id: string;
  name: string;
  email: string;
  skillsTeach: string[];
  skillsLearn: string[];
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await getFriendsList();
        setFriends(response.friends || []);
      } catch (err) {
        setError("Failed to load friends");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleChat = async (friendId: string) => {
    try {
      const response = await createChat(friendId);
      router.push(`/chat/${response.chat._id}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading friends...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Connections
          </h1>
          <p className="text-gray-500 mt-1">
            People you’ve connected with on SkillSwap
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-6">
            Failed to load friends
          </p>
        )}

        {/* Empty State */}
        {friends.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-600">
              You don’t have any connections yet.
            </p>
            <Link
              href="/matches"
              className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {friend.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {friend.email}
                  </p>

                  {/* Skills */}
                  <div className="mt-4 space-y-3">
                    {friend.skillsTeach.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Can Teach
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {friend.skillsTeach.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {friend.skillsLearn.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Wants to Learn
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {friend.skillsLearn.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/profile/${friend._id}`}
                    className="flex-1 text-center px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => handleChat(friend._id)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
