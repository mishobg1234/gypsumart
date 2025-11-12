"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<{ error?: string; success?: string }>;
  confirmMessage?: string;
  confirmTitle?: string;
  onSuccess?: () => void;
  className?: string;
  iconOnly?: boolean;
}

export function DeleteButton({
  id,
  action,
  confirmMessage = "Сигурни ли сте, че искате да изтриете този елемент?",
  confirmTitle = "Потвърдете изтриването",
  onSuccess,
  className = "text-red-600 hover:text-red-900",
  iconOnly = true,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = async () => {
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        setIsModalOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else if (result.error) {
        setIsModalOpen(false);
        alert(result.error);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className={className}
      >
        <Trash2 className="h-4 w-4" />
        {!iconOnly && <span className="ml-2">Изтрий</span>}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Изтрий"
        cancelText="Отказ"
        isLoading={isPending}
      />
    </>
  );
}
