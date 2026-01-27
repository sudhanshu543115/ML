"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import type { AxiosError } from "axios";
import { 
  User, 
  Mail, 
  FileText, 
  Save, 
  X, 
  Plus, 
  Loader2, 
  ArrowLeft,
  GraduationCap,
  BookOpen,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  skillsTeach: string[];
  skillsLearn: string[];
}

interface ApiErrorResponse {
  message?: string;
}

export default function EditProfilePage(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    skillsTeach: [],
    skillsLearn: [],
  });

  const [teachInput, setTeachInput] = useState<string>("");
  const [learnInput, setLearnInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch user profile
  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const res = await api.get("/user/profile");

        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          bio: res.data.user.bio ?? "",
          skillsTeach: res.data.user.skillsTeach ?? [],
          skillsLearn: res.data.user.skillsLearn ?? [],
        });
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const addSkill = (
    type: "skillsTeach" | "skillsLearn",
    value: string
  ): void => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setFormData((prev) => {
      if (prev[type].includes(trimmed)) return prev;
      return { ...prev, [type]: [...prev[type], trimmed] };
    });
  };

  const removeSkill = (
    type: "skillsTeach" | "skillsLearn",
    index: number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put("/user/profile", {
        name: formData.name,
        bio: formData.bio,
        skillsTeach: formData.skillsTeach,
        skillsLearn: formData.skillsLearn,
      });

      router.push("/profile");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <p className="text-indigo-100 mt-1 opacity-90">
              Keep your personal details and skills up to date
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* 1. Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      value={formData.email}
                      disabled
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                </div>

                {/* Bio (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell the community about yourself..."
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Skills Section */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                Skills Profile
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Teaching Skills */}
                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                  <label className="block text-sm font-bold text-indigo-900 mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Skills You Teach
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={teachInput}
                      onChange={(e) => setTeachInput(e.target.value)}
                      placeholder="e.g. React"
                      className="flex-1 px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           e.preventDefault();
                           addSkill("skillsTeach", teachInput);
                           setTeachInput("");
                         }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addSkill("skillsTeach", teachInput);
                        setTeachInput("");
                      }}
                      className="px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {formData.skillsTeach.length === 0 && <span className="text-xs text-indigo-400 italic mt-1">No skills added</span>}
                    {formData.skillsTeach.map((skill, index) => (
                      <span
                        key={index}
                        onClick={() => removeSkill("skillsTeach", index)}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 group transition-all"
                      >
                        {skill}
                        <X className="w-3 h-3 ml-1 text-indigo-300 group-hover:text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Skills */}
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Skills You Learn
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={learnInput}
                      onChange={(e) => setLearnInput(e.target.value)}
                      placeholder="e.g. Node.js"
                      className="flex-1 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           e.preventDefault();
                           addSkill("skillsLearn", learnInput);
                           setLearnInput("");
                         }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addSkill("skillsLearn", learnInput);
                        setLearnInput("");
                      }}
                      className="px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {formData.skillsLearn.length === 0 && <span className="text-xs text-purple-400 italic mt-1">No skills added</span>}
                    {formData.skillsLearn.map((skill, index) => (
                      <span
                        key={index}
                        onClick={() => removeSkill("skillsLearn", index)}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-purple-700 border border-purple-200 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 group transition-all"
                      >
                        {skill}
                        <X className="w-3 h-3 ml-1 text-purple-300 group-hover:text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}