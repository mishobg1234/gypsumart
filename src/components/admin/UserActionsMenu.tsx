"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Shield, Key } from "lucide-react";
import { deleteUser, toggleUserRole } from "@/actions/users";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserActionsMenuProps {
  userId: string;
  userName: string;
  userRole: string;
  isCurrentUser: boolean;
}

export function UserActionsMenu({ userId, userName, userRole, isCurrentUser }: UserActionsMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingRole, setIsTogglingRole] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете ${userName}?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteUser(userId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsDeleting(false);
    setIsOpen(false);
  };

  const handleToggleRole = async () => {
    const newRole = userRole === "ADMIN" ? "потребител" : "администратор";
    if (!confirm(`Сигурни ли сте, че искате да промените ролята на ${userName} на ${newRole}?`)) {
      return;
    }

    setIsTogglingRole(true);
    const result = await toggleUserRole(userId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsTogglingRole(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <Link
                href={`/admin/users/${userId}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактирай
              </Link>

              {isCurrentUser && (
                <Link
                  href="/admin/change-password"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Смени парола
                </Link>
              )}

              {!isCurrentUser && (
                <button
                  onClick={handleToggleRole}
                  disabled={isTogglingRole}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isTogglingRole
                    ? "Променя се..."
                    : userRole === "ADMIN"
                    ? "Направи потребител"
                    : "Направи администратор"}
                </button>
              )}

              {!isCurrentUser && (
                <>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Изтрива се..." : "Изтрий"}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
