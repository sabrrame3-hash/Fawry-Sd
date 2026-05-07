import React from "react";
import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Fuel, 
  GraduationCap, 
  Building2, 
  Zap, 
  Radio, 
  Plane, 
  Smartphone, 
  PlusCircle, 
  Network, 
  HeartHandshake,
  ReceiptText,
  ArrowRight,
  FileText,
  CircleDollarSign,
  Heart
} from "lucide-react";
import FawryLogo from "./FawryLogo";

interface PaymentsScreenProps {
  onBack: () => void;
  onNavigateTelecom: () => void;
}

export default function PaymentsScreen({ onBack, onNavigateTelecom }: PaymentsScreenProps) {
  const [activeTab, setActiveTab] = React.useState<"unregistered" | "registered">("unregistered");

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
           <span className="text-white font-bold text-xl">الدفعيات الإلكترونية</span>
           <div className="relative">
             <FileText size={24} className="text-white" />
             <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.2 border border-fawry-purple">
                <CircleDollarSign size={10} className="text-fawry-purple" />
             </div>
           </div>
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-t-[45px] mt-4 p-8 overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="flex w-full border-b border-gray-100 mb-10 relative">
           <button 
            onClick={() => setActiveTab("unregistered")}
            className={`flex-1 py-4 text-base font-bold transition-all relative z-10 ${
              activeTab === "unregistered" ? "text-fawry-purple" : "text-gray-400"
            }`}
           >
             المستفيدين غير المسجلين
           </button>
           <button 
            onClick={() => setActiveTab("registered")}
            className={`flex-1 py-4 text-base font-bold transition-all relative z-10 ${
              activeTab === "registered" ? "text-fawry-purple" : "text-gray-400"
            }`}
           >
             المستفيدين المسجلين
           </button>
           
           {/* Active Indicator Line */}
           <motion.div 
             layoutId="tab-indicator"
             animate={{ x: activeTab === "unregistered" ? "0%" : "-100%" }}
             className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-fawry-purple"
           />
        </div>

        {/* Grid of Options */}
        <div className="grid grid-cols-3 gap-y-12 gap-x-4">
           <PaymentItem icon={<Fuel size={44} strokeWidth={1.5} />} label="شركات الوقود" />
           <PaymentItem icon={<GraduationCap size={44} strokeWidth={1.5} />} label="التعليم" />
           <PaymentItem icon={<Building2 size={44} strokeWidth={1.5} />} label="الجهات الحكومية والوزارات" />
           
           <PaymentItem icon={<Zap size={44} strokeWidth={1.5} />} label="شركات توزيع الكهرباء" />
           <PaymentItem 
            onClick={onNavigateTelecom}
            icon={<Radio size={44} strokeWidth={1.5} />} 
            label="شركات الاتصالات" 
           />
           <PaymentItem icon={<Plane size={44} strokeWidth={1.5} />} label="خطوط طيران" />

           <PaymentItem 
             icon={
               <div className="font-extrabold text-5xl leading-none italic tracking-tighter">B</div>
             } 
             label="بيدي السودان" 
           />
           <PaymentItem 
             icon={
               <div className="relative">
                 <div className="w-11 h-8 border-[3px] border-fawry-purple rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 bg-fawry-purple rounded-full flex items-center justify-center">
                       <span className="text-white text-[8px]">$</span>
                    </div>
                 </div>
               </div>
             } 
             label="خدمات أخرى" 
           />
           <PaymentItem 
            icon={
              <div className="flex flex-col gap-1.5 -rotate-45">
                <div className="h-2 w-8 bg-fawry-purple rounded-full" />
                <div className="h-2 w-8 bg-fawry-purple rounded-full opacity-60" />
                <div className="h-2 w-8 bg-fawry-purple rounded-full opacity-30" />
              </div>
            } 
            label="القنوات الرقمية المالية" 
           />

           <div className="col-start-3">
             <PaymentItem 
              icon={
                <div className="relative">
                  <Heart size={44} className="fill-fawry-purple text-fawry-purple" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white text-xl">+</div>
                </div>
              } 
              label="التبرعات" 
             />
           </div>
           
           <PaymentItem 
             className="col-start-2 -mt-4"
             icon={
               <div className="w-12 h-12 rounded-full border-[3px] border-fawry-purple flex items-center justify-center">
                  <span className="text-fawry-purple font-black text-2xl">+</span>
               </div>
             } 
             label="فوري بلص" 
           />
        </div>
      </div>
    </div>
  );
}

function PaymentItem({ 
    icon, 
    label, 
    onClick,
    className = "" 
}: { 
    icon: React.ReactNode; 
    label: string; 
    onClick?: () => void;
    className?: string;
}) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group ${className}`}
    >
      <div className="text-fawry-purple transition-all group-hover:scale-110 mb-1">
        {icon}
      </div>
      <span className="text-gray-600 text-[13px] font-bold text-center leading-tight px-1">
        {label}
      </span>
    </motion.button>
  );
}
