"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu";
import { Button } from "@/components/new-button";
import { cn } from "@/lib/utils";
import { Check, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/theme-context";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute z-50 right-0 mr-5 mt-3">

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="scale-95 rounded-full">
            <SunIcon
              className={cn(
                "size-[1.5rem] rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0"
              )}
            />
            <MoonIcon
              className={cn(
                "absolute size-[1.5rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
            <Check
              size={14}
              className={cn("ml-auto", theme !== "light" && "hidden")}
            />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
            <Check
              size={14}
              className={cn("ml-auto", theme !== "dark" && "hidden")}
            />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
            <Check
              size={14}
              className={cn("ml-auto", theme !== "system" && "hidden")}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
