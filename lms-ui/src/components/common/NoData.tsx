import React from 'react';
import Image from 'next/image';

interface NoDataProps {
  message?: string;
  description?: string;
}

const NoData = ({ 
  message = "No Data Found", 
  description = "We couldn't find any records matching your search." 
}: NoDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative w-48 h-48 mb-6">
        <Image 
          src="/NoData.svg" 
          alt="No Data" 
          fill 
          className="object-contain opacity-90 hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
        {message}
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        {description}
      </p>
    </div>
  );
};

export default NoData;
