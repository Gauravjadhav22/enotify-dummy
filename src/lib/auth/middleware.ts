"use server";

import { cookies } from "next/headers";
import { verifyToken } from "./session";
import { db } from "../database";
import { usersTable } from "../database/schema";
import { eq } from "drizzle-orm";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  console.log(sessionCookie.value, "here");

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, sessionData.user.id))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  console.log("user", user);

  return user[0] || null;
}
