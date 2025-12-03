import Link from "next/link";
import { Plus, Edit, FolderTree } from "lucide-react";
import { getCategories, deleteCategory } from "@/actions/categories";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import Image from "next/image";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageHeader
        title="Категории"
        description="Управление на категориите на продуктите"
        actions={
          <Link
            href="/admin/categories/new"
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Добави категория</span>
          </Link>
        }
      />

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма категории
          </h3>
          <p className="text-gray-600 mb-6">
            Започнете като добавите първата си категория
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Добави категория</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Родител
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Продукти
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.image && (
                        <div className="h-10 w-10 flex-shrink-0 relative mr-4">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.parent?.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category._count.products}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteButton
                        id={category.id}
                        action={deleteCategory}
                        confirmTitle="Изтриване на категория"
                        confirmMessage="Сигурни ли сте, че искате да изтриете тази категория? Това може да повлияе на свързаните продукти."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
