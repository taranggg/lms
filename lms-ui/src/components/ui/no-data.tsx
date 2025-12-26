import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NoDataProps {
  message?: string;
  description?: string;
  className?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  message = "No Data Found",
  description = "It looks like there is nothing here yet.",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px] w-full animate-in fade-in zoom-in duration-500", className)}>
      <div className="relative w-48 h-48 mb-6 opacity-90 transition-transform duration-500 hover:scale-105">
        <Image
          src="/NoData.svg"
          alt="No Data"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">{message}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">{description}</p>
    </div>
  );
};
