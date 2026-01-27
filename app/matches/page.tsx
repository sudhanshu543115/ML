"use client";

import { JSX, useEffect, useState } from "react";
import api from "@/api/axios";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Loader2, 
  Send, 
  Search, 
  Sparkles,
  AlertCircle 
} from "lucide-react";

interface TeachMatch {
  _id: string;
  name: string;
  learns: string[];
}

interface LearnMatch {
  _id: string;
  name: string;
  teaches: string[];
}

export default function MatchesPage(): JSX.Element {
  const [teachMatches, setTeachMatches] = useState<TeachMatch[]>([]);
  const [learnMatches, setLearnMatches] = useState<LearnMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async (): Promise<void> => {
      try {
        const res = await api.get("/match/suggestions");

        setTeachMatches(res.data.teachMatches || []);
        setLearnMatches(res.data.learnMatches || []);
      } catch (err) {
        setError("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Analyzing skill compatibility...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            Skill Matches <Sparkles className="w-6 h-6 text-yellow-500 ml-2 fill-yellow-500" />
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Connect with people who complement your skills.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TEACH MATCHES ================= */}
        <section>
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                They want to learn from you
              </h2>
              <p className="text-sm text-gray-500">People looking for the skills you teach</p>
            </div>
          </div>

          {teachMatches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                <Search className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-medium">No learners found matching your skills yet.</p>
              <p className="text-gray-400 text-sm mt-1">Try adding more skills to your profile.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachMatches.map((user) => (
                <MatchCard
                  key={user._id}
                  name={user.name}
                  skills={user.learns}
                  type="teach"
                  userId={user._id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* ================= LEARN MATCHES ================= */}
        <section>
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                They can teach you
              </h2>
              <p className="text-sm text-gray-500">People who have the skills you want to learn</p>
            </div>
          </div>

          {learnMatches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                <Search className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-medium">No teachers found for your goals yet.</p>
              <p className="text-gray-400 text-sm mt-1">Try adding more interests to your profile.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learnMatches.map((user) => (
                <MatchCard
                  key={user._id}
                  name={user.name}
                  skills={user.teaches}
                  type="learn"
                  userId={user._id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ================= MATCH CARD ================= */

function MatchCard({
  name,
  skills,
  type,
  userId,
}: {
  name: string;
  skills: string[];
  type: "teach" | "learn";
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeach = type === "teach";

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post("/connect/request", { toUserId: userId });
      alert("Connection request sent successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between h-full transition-all hover:shadow-md ${isTeach ? 'border-indigo-100 hover:border-indigo-300' : 'border-purple-100 hover:border-purple-300'}`}>
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${isTeach ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {name}
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isTeach ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'}`}>
                {isTeach ? "Student" : "Teacher"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">
            {isTeach ? "Wants to learn:" : "Can teach you:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  isTeach
                    ? "bg-white text-gray-600 border-gray-200"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-gray-50">
        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded text-center">
            {error}
          </p>
        )}
        
        <button
          onClick={handleConnect}
          disabled={loading}
          className={`w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isTeach
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Connect
            </>
          )}
        </button>
      </div>
    </div>
  );
}