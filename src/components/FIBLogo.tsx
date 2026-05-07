import React from "react";

export default function FIBLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-[#006837] rounded-full flex items-center justify-center p-1 border border-white/20">
        <svg viewBox="0 0 100 100" fill="white" className="w-full h-full">
           <path d="M50 10 L10 50 L50 90 L90 50 Z M50 25 L25 50 L50 75 L75 50 Z" />
        </svg>
      </div>
      <div className="flex flex-col items-end leading-tight">
        <span className="font-bold text-white text-xs">بنك فيصل الإسلامي</span>
        <span className="text-[10px] text-white/70">Sudan FIB</span>
      </div>
    </div>
  );
}
