"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface ApproveButtonProps {
  id: string;
  action: (id: string) => Promise<{ error?: string; success?: string }>;
  className?: string;
}

export function ApproveButton({
  id,
  action,
  className = "text-green-600 hover:text-green-900 p-2 border border-green-300 hover:border-green-500 rounded transition",
}: ApproveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApprove = async () => {
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
      onClick={handleApprove}
      disabled={isPending}
      className={className}
      title="Одобри"
    >
      <Check className="h-5 w-5" />
    </button>
  );
}
