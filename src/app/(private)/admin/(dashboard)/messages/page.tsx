import { MessageSquare, Mail, Phone } from "lucide-react";
import { getContactMessages, markMessageAsRead, deleteContactMessage } from "@/actions/misc";
import { PageHeader } from "@/components/admin/PageHeader";
import { MarkAsReadButton } from "@/components/admin/MarkAsReadButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function MessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <PageHeader
        title="Съобщения"
        description="Съобщения от формата за контакт"
      />

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма съобщения
          </h3>
          <p className="text-gray-600">
            Все още няма получени съобщения
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow p-6 ${
                !message.read ? "border-l-4 border-green-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {message.name}
                    </h3>
                    {!message.read && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Ново
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(message.createdAt).toLocaleString("bg-BG")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!message.read && (
                    <MarkAsReadButton
                      id={message.id}
                      action={markMessageAsRead}
                    />
                  )}
                  <DeleteButton
                    id={message.id}
                    action={deleteContactMessage}
                    confirmTitle="Изтриване на съобщение"
                    confirmMessage="Сигурни ли сте, че искате да изтриете това съобщение?"
                    className="text-red-600 hover:text-red-900 p-2 border border-red-300 hover:border-red-500 rounded transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
