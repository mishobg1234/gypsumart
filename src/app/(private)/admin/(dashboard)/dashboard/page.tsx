import Link from "next/link";
import { Package, ShoppingCart, MessageSquare, FileText, Eye } from "lucide-react";
import { getProducts } from "@/actions/products";
import { getOrders } from "@/actions/orders";
import { getContactMessages } from "@/actions/misc";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { formatPriceHTML } from "@/lib/currency";

export default async function AdminDashboard() {
  const [products, orders, messages] = await Promise.all([
    getProducts(),
    getOrders(),
    getContactMessages(),
  ]);

  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Чакаща";
      case "PROCESSING":
        return "Обработва се";
      case "SHIPPED":
        return "Изпратена";
      case "DELIVERED":
        return "Доставена";
      case "CANCELLED":
        return "Отказана";
      default:
        return status;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Преглед на вашия магазин" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Общо продукти"
          value={products.length}
          icon={Package}
          href="/admin/products"
          color="blue"
        />
        <StatCard
          title="Активни поръчки"
          value={pendingOrders}
          icon={ShoppingCart}
          href="/admin/orders"
          color="green"
        />
        <StatCard
          title="Непрочетени съобщения"
          value={unreadMessages}
          icon={MessageSquare}
          href="/admin/messages"
          color="amber"
        />
        <StatCard
          title="Всички поръчки"
          value={orders.length}
          icon={FileText}
          href="/admin/orders"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Последни поръчки</h2>
            <Link
              href="/admin/orders"
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Виж всички
            </Link>
          </div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Няма поръчки</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-gray-900">{formatPriceHTML(order.totalAmount).full}</p>
                    <p className="text-sm text-gray-600">{getStatusText(order.status)}</p>
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 transition p-2"
                    title="Виж поръчка"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Последни съобщения</h2>
            <Link
              href="/admin/messages"
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Виж всички
            </Link>
          </div>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Няма съобщения</p>
            ) : (
              messages.slice(0, 5).map((message) => (
                <div key={message.id} className="py-3 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{message.name}</p>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.read && (
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">
                          Ново
                        </span>
                      )}
                      <Link
                        href={`/admin/messages`}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                        title="Виж съобщение"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
