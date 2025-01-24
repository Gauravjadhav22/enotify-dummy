import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";
import theUltimateSmall from "@/../public/assets/logo/theultimateio-small.png"
import ultimateIo from "@/../public/assets/logo/theultimateio.png"
export const Logo = () => {
  const state  = "collapsed";

  const { width, height, className } = useMemo(() => {
    if (state === "collapsed") {
      return { width: 34, height: 34, className: "" };
    }
    return { width: 100, height: 100, className: "w-full h-full" };
  }, [state]);

  return (
    <div className="relative w-full h-full">
      <Image
        src={
          state === "collapsed"
            ? theUltimateSmall
            : ultimateIo
        }
        alt="Logo"
        width={width}
        height={height}
        className={cn(className)}
      />
    </div>
  );
};
