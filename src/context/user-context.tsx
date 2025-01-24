"use client";

import { logoutAction } from "@/lib/actions/logout-action";
import { User } from "@/lib/database/schema";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { use } from "react";
import { toast } from "sonner";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  const initialUser = use(userPromise);
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter()
  const { execute } = useAction(logoutAction, {
    onSuccess: () => {
      toast.success("Logged out successfully");
      setUser(null);
      router.push("/auth/login");
    },
    onError: (error) => {
      toast.error(error.error?.serverError || "Logout failed");
    },
    onExecute: (data) => {
      console.log("Logout action executed", data);
    },
  });

  const logout = async () => {
    await execute();
  };
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
