"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  FileText, 
  Plus, 
  X, 
  Loader2, 
  GraduationCap, 
  BookOpen, 
  AlertCircle 
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    skillsTeach: [] as string[],
    skillsLearn: [] as string[],
  });

  const [skillTeachInput, setSkillTeachInput] = useState("");
  const [skillLearnInput, setSkillLearnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (type: "skillsTeach" | "skillsLearn", value: string) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
  };

  const removeSkill = (type: "skillsTeach" | "skillsLearn", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white p-8 pb-0 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join the community to share skills and learn something new
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-6">
          
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              />
            </div>

            {/* Bio */}
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="bio"
                placeholder="Tell us a little about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 resize-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Skills Profile
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Teaching Section */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <label className="block text-sm font-semibold text-indigo-900 mb-2 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-indigo-600" />
                  I want to Teach
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillTeachInput}
                    onChange={(e) => setSkillTeachInput(e.target.value)}
                    placeholder="e.g. Guitar"
                    className="flex-1 px-3 py-2 text-sm border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill("skillsTeach", skillTeachInput);
                        setSkillTeachInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addSkill("skillsTeach", skillTeachInput);
                      setSkillTeachInput("");
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                  {formData.skillsTeach.length === 0 && (
                    <span className="text-xs text-indigo-400 italic mt-1">No skills added yet</span>
                  )}
                  {formData.skillsTeach.map((skill, index) => (
                    <span
                      key={index}
                      onClick={() => removeSkill("skillsTeach", index)}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group"
                    >
                      {skill}
                      <X className="w-3 h-3 ml-1 text-indigo-400 group-hover:text-red-500" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Section */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <label className="block text-sm font-semibold text-purple-900 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                  I want to Learn
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillLearnInput}
                    onChange={(e) => setSkillLearnInput(e.target.value)}
                    placeholder="e.g. Coding"
                    className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill("skillsLearn", skillLearnInput);
                        setSkillLearnInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addSkill("skillsLearn", skillLearnInput);
                      setSkillLearnInput("");
                    }}
                    className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                  {formData.skillsLearn.length === 0 && (
                    <span className="text-xs text-purple-400 italic mt-1">No skills added yet</span>
                  )}
                  {formData.skillsLearn.map((skill, index) => (
                    <span
                      key={index}
                      onClick={() => removeSkill("skillsLearn", index)}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-purple-700 border border-purple-200 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group"
                    >
                      {skill}
                      <X className="w-3 h-3 ml-1 text-purple-400 group-hover:text-red-500" />
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating Account...
              </span>
            ) : (
              "Complete Registration"
            )}
          </button>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}