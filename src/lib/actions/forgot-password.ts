"use server";

import { actionClient } from "./safe-action";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { usersTable } from "@/lib/database/schema";
import { returnValidationErrors } from "next-safe-action";
import { forgotPasswordSchema } from "./schema";

// Create forgot password action
export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    // Check if user exists with phone
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, parsedInput.phone))
      .limit(1);

    if (!user) {
      return returnValidationErrors(forgotPasswordSchema, {
        _errors: ["No user found with this phone number"],
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  });
