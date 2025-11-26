"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as UserRole,
    };

    if (!user) {
      setError("Не може да създавате потребители през админ панела");
      setIsLoading(false);
      return;
    }

    const result = await updateUser(user.id, data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/users");
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Основна информация
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Име *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={user?.name || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={user?.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Роля *
            </label>
            <select
              name="role"
              defaultValue={user?.role}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="USER">Потребител</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
        >
          {isLoading ? "Запазване..." : "Обнови потребител"}
        </button>
      </div>
    </form>
  );
}
