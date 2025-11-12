import { notFound } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/actions/orders";
import { PageHeader, Breadcrumb } from "@/components/admin";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      <Breadcrumb customLabel={`#${order.id.slice(0, 8).toUpperCase()}`} />
      <Link
        href="/admin/orders"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Назад към поръчките</span>
      </Link>

      <PageHeader
        title={`Поръчка #${order.id.slice(0, 8).toUpperCase()}`}
        description={`Създадена на ${format(
          new Date(order.createdAt),
          "dd MMMM yyyy 'в' HH:mm",
          { locale: bg }
        )}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Продукти</h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const images = JSON.parse(item.product.images) as string[];
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 relative">
                      {images[0] ? (
                        <Image
                          src={images[0]}
                          alt={item.product.name}
                          fill
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} лв
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.price.toFixed(2)} лв / бр
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Продукти:</span>
                <span>{(order.totalAmount - order.deliveryFee).toFixed(2)} лв</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка:</span>
                <span>{order.deliveryFee === 0 ? "Безплатна" : `${order.deliveryFee.toFixed(2)} лв`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Общо:</span>
                <span>{order.totalAmount.toFixed(2)} лв</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Бележки
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Статус</h2>
            <span
              className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>

            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Номер за проследяване:</p>
                <p className="font-mono font-semibold text-green-700">
                  {order.trackingNumber}
                </p>
              </div>
            )}

            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              currentTrackingNumber={order.trackingNumber}
              action={updateOrderStatus}
            />
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Информация за клиента
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Име</p>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {order.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Телефон</p>
                <p className="font-medium text-gray-900">
                  {order.customerPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Информация за доставка
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Куриер</p>
                <p className="font-medium text-gray-900">
                  {order.courier === "speedy" ? "Спиди" : "Еконт"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Метод на доставка</p>
                <p className="font-medium text-gray-900">
                  {order.deliveryMethod === "office" ? "До офис" : "До адрес"}
                </p>
              </div>
              {order.deliveryMethod === "office" && order.deliveryOffice && (
                <div>
                  <p className="text-sm text-gray-600">Офис</p>
                  <p className="font-medium text-gray-900">{order.deliveryOffice}</p>
                </div>
              )}
              {order.deliveryMethod === "address" && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Град</p>
                    <p className="font-medium text-gray-900">{order.deliveryCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Адрес</p>
                    <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>
                  {order.deliveryPostalCode && (
                    <div>
                      <p className="text-sm text-gray-600">Пощенски код</p>
                      <p className="font-medium text-gray-900">{order.deliveryPostalCode}</p>
                    </div>
                  )}
                </>
              )}
              <div>
                <p className="text-sm text-gray-600">Начин на плащане</p>
                <p className="font-medium text-gray-900">Наложен платеж</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
