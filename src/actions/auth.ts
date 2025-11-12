"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { prisma } from "@/db/prisma";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { z } from "zod";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });

    return { success: "Успешен вход!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Невалиден имейл или парола!" };
        default:
          return { error: "Нещо се обърка!" };
      }
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Имейлът вече съществува!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  return { success: "Потребителят е създаден!" };
}
