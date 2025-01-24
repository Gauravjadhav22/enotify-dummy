"use server";

import { actionClient } from "./safe-action";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { usersTable } from "@/lib/database/schema";
import { comparePasswords, setSession } from "@/lib/auth/session";
import { returnValidationErrors } from "next-safe-action";
import { loginSchema } from "./schema";

// Create login action
export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, parsedInput.phone))
      .limit(1);

    console.log("user", user);

    if (!user) {
      return returnValidationErrors(loginSchema, {
        _errors: ["Incorrect phone number or password"],
      });
    }

    // Verify password
    const isValidPassword = await comparePasswords(
      parsedInput.password,
      user.password
    );
    if (!isValidPassword) {
      return returnValidationErrors(loginSchema, {
        _errors: ["Incorrect phone number or password"],
      });
    }

    // Create session
    const session = await setSession(user);

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      session,
    };
  });
