import { Search, User } from "lucide-react";
import { auth } from "@/auth";
import { NotificationDropdown } from "./NotificationDropdown";
import { getNotifications, getUnreadNotificationsCount } from "@/actions/notifications";

export async function AdminHeader() {
  const session = await auth();
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadNotificationsCount(),
  ]);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Търсене..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <NotificationDropdown 
            initialNotifications={notifications}
            initialUnreadCount={unreadCount}
          />

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || "Администратор"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email || "admin@gypsumart.bg"}
              </p>
            </div>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Admin"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
