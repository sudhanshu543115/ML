"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface User {
  name: string;
}

interface NavbarProps {
  isAuthenticated: boolean;
  user?: User | null;
  unreadCount?: number;
}

export default function Navbar({ isAuthenticated, user, unreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const linkClass = (path: string) =>
    pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-700 hover:text-indigo-600";

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          M<span className="text-pink-500">L</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/matches" className={linkClass("/matches")}>
                Matches
              </Link>
              <Link href="/chat" className={linkClass("/chat")}>
                Chat
              </Link>
              <Link href="/notifications" className={linkClass("/notifications")}>
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/requests" className={linkClass("/requests")}>
                Requests
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="px-4 py-3 text-sm text-gray-700 border-b">
                  Signed in as
                  <div className="font-semibold">{user?.name}</div>
                </div>

                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  View Profile
                </Link>

                <Link
                  href="/profile/edit"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Update Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-700 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
