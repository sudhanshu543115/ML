"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Search, 
  MessageSquare, 
  Edit3, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Decoration */}
      <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 w-full absolute top-0 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div className="flex items-center space-x-5 text-white">
            <div className="h-20 w-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-indigo-100 mt-1 flex items-center text-sm opacity-90">
                <Mail className="w-4 h-4 mr-1.5" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0 space-x-3">
             <Link
              href="/dashboard/freinds"
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-medium text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              All Friends
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-medium text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Profile & Bio) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-500" />
                About You
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-gray-600 text-sm leading-relaxed">
                {user.bio ? (
                  user.bio
                ) : (
                  <span className="text-gray-400 italic">
                    No bio added yet. Tell people about yourself!
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats or Promo (Optional Visual Filler) */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                Pro Tip
              </h3>
              <p className="text-sm text-indigo-800 mt-2">
                Completing your profile increases your chances of finding a match by 3x.
              </p>
            </div>
          </div>

          {/* Right Column (Skills & Actions) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/matches"
                className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">Find Matches</h4>
                <p className="text-xs text-gray-500 mt-1">Discover people who match your skills</p>
              </Link>

              <Link
                href="/chat"
                className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">Chats</h4>
                <p className="text-xs text-gray-500 mt-1">Continue your conversations</p>
              </Link>

              <Link
                href="/profile"
                className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="h-10 w-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">Profile</h4>
                <p className="text-xs text-gray-500 mt-1">Update your skills and bio</p>
              </Link>
            </div>

            {/* Skills Section */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Teaching Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-50 bg-indigo-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                    You Teach
                  </h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {user.skillsTeach.length}
                  </span>
                </div>
                <div className="p-6 flex-grow">
                  {user.skillsTeach.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">No teaching skills added.</p>
                      <Link href="/profile" className="text-xs text-indigo-600 font-medium hover:underline mt-1 inline-block">Add a skill</Link>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skillsTeach.map((skill: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-50 bg-purple-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                    You Learn
                  </h3>
                  <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {user.skillsLearn.length}
                  </span>
                </div>
                <div className="p-6 flex-grow">
                  {user.skillsLearn.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">No learning goals added.</p>
                      <Link href="/profile" className="text-xs text-purple-600 font-medium hover:underline mt-1 inline-block">Add a goal</Link>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skillsLearn.map((skill: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
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
      </div>
    </div>
  );
}