import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, Repeat, CircleDollarSign, Users, RefreshCw, Building2, CalendarDays } from "lucide-react";

interface TransfersScreenProps {
  onBack: () => void;
  onNavigateOtherBank: () => void;
}

export default function TransfersScreen({ onBack, onNavigateOtherBank }: TransfersScreenProps) {
  return (
    <div className="min-h-screen bg-fawry-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-6 relative">
        <button 
          onClick={onBack}
          className="p-2 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all text-white border border-white/20"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        
        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
           <span className="text-white font-bold text-xl">التحاويل</span>
           <div className="relative">
             <Repeat size={24} className="text-white" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.2">
                <CircleDollarSign size={10} className="text-fawry-purple" />
             </div>
           </div>
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[45px] mt-4 p-8 overflow-y-auto">
        <div className="flex flex-col gap-4">
           <TransferOptionItem 
            icon={<Users className="text-fawry-purple" size={32} />} 
            label="بين حساباتي" 
           />
           
           <TransferOptionItem 
            icon={
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute border-2 border-fawry-purple rounded-full w-full h-full border-t-transparent animate-spin-slow" />
                <div className="absolute border-2 border-fawry-purple rounded-full w-2/3 h-2/3 border-b-transparent animate-reverse-spin-slow" />
              </div>
            } 
            label="التحويل إلى بنك فيصل" 
           />

           <TransferOptionItem 
            onClick={onNavigateOtherBank}
            icon={<Building2 className="text-fawry-purple" size={32} />} 
            label="تحويل لبنك آخر" 
           />

           <TransferOptionItem 
            icon={
              <div className="relative">
                <CalendarDays className="text-fawry-purple" size={32} />
                <div className="absolute -bottom-1 -right-1 bg-fawry-purple rounded-full p-0.5 border border-white">
                   <div className="w-2 h-2 rounded-full border border-white" />
                </div>
              </div>
            } 
            label="أوامر الدفع الدائم" 
           />
        </div>
      </div>
    </div>
  );
}

function TransferOptionItem({ 
    icon, 
    label, 
    onClick, 
    isHighlighted = false 
}: { 
    icon: React.ReactNode; 
    label: string; 
    onClick?: () => void;
    isHighlighted?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "rgba(128, 0, 128, 0.05)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-6 rounded-xl border transition-all ${
        isHighlighted ? 'border-red-500 ring-4 ring-red-500/30 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-6">
         <div className="w-12 h-12 flex items-center justify-center">
            {icon}
         </div>
         <span className="text-fawry-dark text-xl font-bold">{label}</span>
      </div>
    </motion.button>
  );
}
