// "use server";

import { actionClient } from "./safe-action";
import { clearSession } from "@/lib/auth/session"; 

export const logoutAction = actionClient.action(async () => {
  await clearSession();
  return {
    success: true,
    message: "Logged out successfully",
  };
});
