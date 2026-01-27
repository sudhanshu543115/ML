"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Calendar, 
  Edit3, 
  Star, 
  GraduationCap, 
  BookOpen, 
  Loader2, 
  MapPin,
  MessageSquare
} from "lucide-react";
import api from "@/api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  skillsTeach: string[];
  skillsLearn: string[];
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data.user);
      } catch (err: any) {
        setError("Failed to load profile");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Cover Gradient Banner */}
      <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 w-full relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* 2. Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              
              {/* Left: Avatar & Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full">
                {/* Avatar */}
                <div className="h-32 w-32 rounded-full bg-white p-1.5 shadow-md -mt-20 sm:-mt-24 ring-1 ring-gray-100">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl font-bold text-indigo-600 border border-gray-100">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name & Meta */}
                <div className="text-center sm:text-left flex-1 min-w-0 pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 truncate">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                      {user.email}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                      Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 mt-4 sm:mt-0">
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                About
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {user.bio || (
                  <span className="italic text-gray-400">
                    No bio description provided yet.
                  </span>
                )}
              </p>
            </div>

            {/* Reputation / Stats Row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="col-span-1">
                <span className="block text-xs font-medium text-gray-500 uppercase">Rating</span>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{user.rating.toFixed(1)}</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div className="col-span-1">
                <span className="block text-xs font-medium text-gray-500 uppercase">Reviews</span>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{user.totalReviews}</span>
                  <MessageSquare className="w-5 h-5 text-gray-300" />
                </div>
              </div>
              <div className="col-span-1">
                <span className="block text-xs font-medium text-gray-500 uppercase">Teaching</span>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{user.skillsTeach.length}</span>
                  <span className="text-xs text-gray-400">Skills</span>
                </div>
              </div>
              <div className="col-span-1">
                <span className="block text-xs font-medium text-gray-500 uppercase">Learning</span>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{user.skillsLearn.length}</span>
                  <span className="text-xs text-gray-400">Skills</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Skills Grid Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
          {/* Teach Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Skills You Teach</h3>
            </div>
            
            <div className="flex-grow">
              {user.skillsTeach.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500">You haven't added any teaching skills.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skillsTeach.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Learn Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Skills You Want to Learn</h3>
            </div>
            
            <div className="flex-grow">
              {user.skillsLearn.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500">You haven't added any learning goals.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skillsLearn.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}