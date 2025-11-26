import { Search, User } from "lucide-react";
import { auth } from "@/auth";
import { NotificationDropdown } from "./NotificationDropdown";
import { getNotifications, getUnreadNotificationsCount } from "@/actions/notifications";
import { UserProfileMenu } from "./UserProfileMenu";

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

          <UserProfileMenu
            userId={session?.user?.id || ""}
            userName={session?.user?.name || "Администратор"}
            userEmail={session?.user?.email || "admin@artbuildshop.bg"}
            userImage={session?.user?.image}
          />
        </div>
      </div>
    </header>
  );
}
