"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/actions/users";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log("ChangePasswordForm userId:", userId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("Submitting password change for userId:", userId);

    if (newPassword !== confirmPassword) {
      setError("Новите пароли не съвпадат!");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Паролата трябва да бъде поне 6 символа!");
      setIsLoading(false);
      return;
    }

    const result = await changePassword(userId, currentPassword, newPassword);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || "Паролата е променена успешно!");
      // Clear form
      (e.target as HTMLFormElement).reset();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Смяна на парола
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текуща парола *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нова парола *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Минимум 6 символа
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Потвърди новата парола *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
          {isLoading ? "Променя се..." : "Промени паролата"}
        </button>
      </div>
    </form>
  );
}
