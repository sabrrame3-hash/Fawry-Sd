import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, Radio } from "lucide-react";

interface TelecomScreenProps {
  onBack: () => void;
}

export default function TelecomScreen({ onBack }: TelecomScreenProps) {
  return (
    <div className="min-h-screen bg-[#4b0082] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-6 relative">
         <button 
          onClick={onBack}
          className="p-2 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all text-white border border-white/20"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
           <span className="text-white font-bold text-xl">شركات الاتصالات</span>
           <Radio className="text-white" size={24} />
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[45px] mt-4 p-8">
        <div className="grid grid-cols-3 gap-6">
           <TelecomGridItem 
             name="شركة إم تي إن" 
             bgColor="#ffcc00"
             logo={
               <div className="flex flex-col items-center">
                  <div className="border-[3px] border-black rounded-full px-3 py-1 font-black text-black text-lg scale-110">MTN</div>
               </div>
             }
           />
           <TelecomGridItem 
             name="شركة سوداني" 
             bgColor="white"
             logo={
               <div className="flex flex-col items-center gap-1">
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <div className="w-3.5 h-3.5 bg-[#1a0066] rounded-sm transform rotate-12" />
                    <div className="w-3.5 h-3.5 bg-[#1a0066] rounded-sm transform -rotate-6" />
                    <div className="w-3.5 h-3.5 bg-[#1a0066] rounded-sm transform -rotate-12" />
                    <div className="w-3.5 h-3.5 bg-[#1a0066] rounded-sm transform rotate-6" />
                  </div>
                  <span className="text-[#1a0066] font-black text-base tracking-tighter">sudani</span>
               </div>
             }
           />
           <TelecomGridItem 
             name="شركة زين" 
             bgColor="white"
             logo={
                <div className="flex flex-col items-center relative">
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 fill-none stroke-current stroke-[3]">
                       <circle cx="50" cy="50" r="45" strokeDasharray="5 5" />
                       <path d="M50 15 C75 15 85 40 50 85" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-cyan-800 font-black text-sm absolute -bottom-1">zain</span>
                </div>
             }
           />
        </div>
      </div>
    </div>
  );
}

function TelecomGridItem({ name, logo, bgColor = "transparent" }: { name: string; logo: React.ReactNode; bgColor?: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-3 group"
    >
      <div 
        className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md border border-gray-100 transition-all group-hover:shadow-lg overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {logo}
      </div>
      <span className="text-[#800080] text-xs font-bold text-center leading-tight">
        {name}
      </span>
    </motion.button>
  );
}
