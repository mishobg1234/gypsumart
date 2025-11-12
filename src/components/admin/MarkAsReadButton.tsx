"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface MarkAsReadButtonProps {
  id: string;
  action: (id: string) => Promise<{ error?: string; success?: string }>;
}

export function MarkAsReadButton({ id, action }: MarkAsReadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        router.refresh();
      } else if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-blue-600 hover:text-blue-900 px-3 py-2 border border-blue-300 hover:border-blue-500 rounded transition text-sm disabled:opacity-50"
    >
      {isPending ? "Обработва се..." : "Маркирай като прочетено"}
    </button>
  );
}
