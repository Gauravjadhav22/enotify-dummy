import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { getUser } from "@/lib/auth/middleware";
import "../globals.css";
import { redirect } from "next/navigation";
import "../style.css";
import { SidebarProvider, SidebarTrigger } from "@/components/Sidebar"
import { AppSidebar } from "@/components/ui/navigation/AppSidebar"
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { cookies } from "next/headers"
import { siteConfig } from "../siteConfig";
import { UserProvider } from "@/context/user-context";
import { ThemeSwitch } from "@/components/theme-switch";
import { ThemeProvider } from "@/context/theme-context";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  console.log("user", user);

  // if (!user) {
  //   return redirect("/auth/login");
  // }
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (

    <UserProvider userPromise={getUser()}>
      <ThemeProvider
        defaultTheme="system"
      >
        <SidebarProvider defaultOpen={defaultOpen}>
        <ThemeSwitch />

          <AppSidebar />
          <div className="w-full">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
              <SidebarTrigger className="-ml-1" />
              <div className="mr-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
              <Breadcrumbs />
            </header>
            <main>{children}</main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </UserProvider>

  );
}
