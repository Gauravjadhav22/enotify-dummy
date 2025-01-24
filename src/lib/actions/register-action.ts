"use server";

import { actionClient } from "./safe-action";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { usersTable, organizationTable } from "@/lib/database/schema";
import { hashPassword, setSession } from "@/lib/auth/session";
import { returnValidationErrors } from "next-safe-action";
import { registerSchema } from "./schema";

// Create register action
export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    // Check if user already exists with email or phone
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parsedInput.email))
      .limit(1);
    console.log(existingUser);

    if (existingUser.length > 0) {
      return returnValidationErrors(registerSchema, {
        _errors: ["User with this email already exists"],
      });
    }

    const existingPhone = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, parsedInput.phone))
      .limit(1);

    if (existingPhone.length > 0) {
      return returnValidationErrors(registerSchema, {
        _errors: ["User with this phone number already exists"],
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(parsedInput.password);

    // Create user
    const [user] = await db
      .insert(usersTable)
      .values({
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phone,
        status: "ACTIVE",
        password: hashedPassword,
        role: "USER",
      })
      .returning();

    if (!user) {
      return returnValidationErrors(registerSchema, {
        _errors: ["Failed to create user"],
      });
    }

    // Create organization
    const [organization] = await db
      .insert(organizationTable)
      .values({
        name: parsedInput.companyName,
        currency: "INR",
      })
      .returning();

    if (!organization) {
      return returnValidationErrors(registerSchema, {
        _errors: ["Failed to create organization"],
      });
    }

    // Create session
    const session = await setSession(user);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      session,
    };
  });
