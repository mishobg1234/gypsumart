"use client";

import { useState } from "react";
import { User, Key, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import Image from "next/image";

interface UserProfileMenuProps {
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export function UserProfileMenu({ userId, userName, userEmail, userImage }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative flex items-center space-x-3 pl-4 border-l border-gray-200">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {userName}
        </p>
        <p className="text-xs text-gray-500">
          {userEmail}
        </p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
      >
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={256}
            height={256}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-green-700 transition">
            <User className="h-5 w-5" />
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-14 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>

              <Link
                href="/admin/change-password"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Key className="h-4 w-4 mr-3" />
                Смени парола
              </Link>

              <div className="border-t border-gray-200 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Изход
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
