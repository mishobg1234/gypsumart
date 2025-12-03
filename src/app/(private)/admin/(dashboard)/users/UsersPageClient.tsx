"use client";

import { useState } from "react";
import { Users, UserCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserActionsMenu } from "@/components/admin/UserActionsMenu";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  _count: {
    orders: number;
    reviews: number;
  };
}

interface UsersPageClientProps {
  users: User[];
  currentUserId: string;
}

export function UsersPageClient({ users, currentUserId }: UsersPageClientProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const userCount = users.filter(u => u.role === "USER").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <PageHeader
            title="Потребители"
            description="Управление на потребителските акаунти"
          />
          <div className="flex gap-3 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {adminCount} {adminCount === 1 ? "Администратор" : "Администратори"}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {userCount} {userCount === 1 ? "Потребител" : "Потребители"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <UserPlus className="h-5 w-5" />
          Добави потребител
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма потребители
          </h3>
          <p className="text-gray-600 mb-4">
            Все още няма регистрирани потребители
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <UserPlus className="h-5 w-5" />
            Добави първи потребител
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Потребител
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роля
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Поръчки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отзиви
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата на регистрация
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || user.username || "Няма име"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Администратор" : "Потребител"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.reviews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("bg-BG")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <UserActionsMenu
                      userId={user.id}
                      userName={user.name || user.email}
                      userRole={user.role}
                      isCurrentUser={currentUserId === user.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateForm && (
        <CreateUserForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}
