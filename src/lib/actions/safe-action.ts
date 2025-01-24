import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { getSessionId } from "../auth/session";

// Custom error class for action-specific errors
class ActionError extends Error {}

// Create base action client with error handling and metadata schema
export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error("Action error:", e.message);
    return e instanceof ActionError ? e.message : DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

// Add auth middleware to base client
export const authActionClient = actionClient.use(async ({ next }) => {
  const userId = await getSessionId();
  if (!userId) throw new Error("Session is not valid!");
  return next({ ctx: { userId } });
});
