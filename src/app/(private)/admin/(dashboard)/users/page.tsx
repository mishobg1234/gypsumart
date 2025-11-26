import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { UsersPageClient } from "./UsersPageClient";

export default async function UsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  return <UsersPageClient users={users} currentUserId={session?.user?.id || ""} />;
}
