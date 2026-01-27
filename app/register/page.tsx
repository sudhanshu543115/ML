"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  X,
  Loader2,
  GraduationCap,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Search,
  CheckCircle2,
} from "lucide-react";
import api from "@/api/axios";
import { getSkills } from "@/api/Allapi";

type Skill = {
  _id: string;
  name: string;
  category: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    skillsTeach: [] as string[],
    skillsLearn: [] as string[],
  });

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [skillTeachInput, setSkillTeachInput] = useState("");
  const [skillLearnInput, setSkillLearnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH SKILLS ================= */
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getSkills();
        setAllSkills(data);
      } catch (err) {
        console.error("Failed to load skills");
      }
    };
    loadSkills();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (type: "skillsTeach" | "skillsLearn", value: string) => {
    if (!value) return;
    if (formData[type].includes(value)) return;
    if (type === "skillsTeach" && formData.skillsLearn.includes(value)) return;
    if (type === "skillsLearn" && formData.skillsTeach.includes(value)) return;

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));
  };

  const removeSkill = (type: "skillsTeach" | "skillsLearn", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* ================= FILTERED SKILLS ================= */
  const filteredTeachSkills = allSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(skillTeachInput.toLowerCase()) &&
      !formData.skillsTeach.includes(s.name) &&
      !formData.skillsLearn.includes(s.name)
  );

  const filteredLearnSkills = allSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(skillLearnInput.toLowerCase()) &&
      !formData.skillsLearn.includes(s.name) &&
      !formData.skillsTeach.includes(s.name)
  );

  /* ================= SUBMIT ================= */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/register", formData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Registration failed");
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
    <div className="min-h-screen flex bg-white text-slate-900">
      
      {/* ================= LEFT PANEL (BRANDING) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            SkillSwap
          </h2>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Exchange Knowledge.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Grow Together.
            </span>
          </h1>
          <p className="text-slate-300 text-lg">
            Join a community of thousands where teaching is the currency for learning. 
            Find a mentor, become a guide, and unlock your potential.
          </p>
          
          <div className="space-y-3 pt-4">
             {['Smart Skill Matching', 'Community Driven Learning', 'Real-time Mentorship'].map((item, i) => (
               <div key={i} className="flex items-center gap-3 text-slate-300">
                 <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                 <span>{item}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-sm">
          © 2024 SkillSwap Inc. All rights reserved.
        </div>
      </div>

      {/* ================= RIGHT PANEL (FORM) ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
            <p className="mt-2 text-slate-500">
              Enter your details to get started with your journey.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* --- Personal Info --- */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <textarea
                name="bio"
                placeholder="Short bio: Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Skills Profile
                </span>
              </div>
            </div>

            {/* --- Skills Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TEACH COLUMN */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  I want to Teach
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={skillTeachInput}
                    onChange={(e) => setSkillTeachInput(e.target.value)}
                    placeholder="Add skills (e.g. React)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                  
                  {/* Dropdown */}
                  {skillTeachInput && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-100 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredTeachSkills.length > 0 ? filteredTeachSkills.map((skill) => (
                        <div
                          key={skill._id}
                          onClick={() => {
                            addSkill("skillsTeach", skill.name);
                            setSkillTeachInput("");
                          }}
                          className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex justify-between items-center group transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">{skill.name}</span>
                          <span className="text-xs text-slate-400 border border-slate-100 px-2 py-0.5 rounded bg-slate-50">{skill.category}</span>
                        </div>
                      )) : (
                        <div className="px-4 py-3 text-sm text-slate-400 text-center">No skills found</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Chips */}
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.skillsTeach.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 animate-in fade-in zoom-in-90">
                      {skill}
                      <button type="button" onClick={() => removeSkill("skillsTeach", i)} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.skillsTeach.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-1">No skills selected</span>
                  )}
                </div>
              </div>

              {/* LEARN COLUMN */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  I want to Learn
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={skillLearnInput}
                    onChange={(e) => setSkillLearnInput(e.target.value)}
                    placeholder="Add skills (e.g. Piano)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />

                  {/* Dropdown */}
                  {skillLearnInput && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-100 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredLearnSkills.length > 0 ? filteredLearnSkills.map((skill) => (
                        <div
                          key={skill._id}
                          onClick={() => {
                            addSkill("skillsLearn", skill.name);
                            setSkillLearnInput("");
                          }}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex justify-between items-center group transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{skill.name}</span>
                          <span className="text-xs text-slate-400 border border-slate-100 px-2 py-0.5 rounded bg-slate-50">{skill.category}</span>
                        </div>
                      )) : (
                        <div className="px-4 py-3 text-sm text-slate-400 text-center">No skills found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.skillsLearn.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 animate-in fade-in zoom-in-90">
                      {skill}
                      <button type="button" onClick={() => removeSkill("skillsLearn", i)} className="hover:text-indigo-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                   {formData.skillsLearn.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-1">No skills selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}