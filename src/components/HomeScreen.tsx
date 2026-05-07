import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  LogOut, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  QrCode, 
  ArrowRightLeft, 
  Wallet, 
  Settings, 
  MoreHorizontal,
  CircleDollarSign,
  Repeat,
  FileText
} from "lucide-react";
import FawryLogo from "./FawryLogo";
import { useAuth } from "../context/AuthContext";

interface HomeScreenProps {
  onLogout: () => void;
  onNavigatePayments: () => void;
  onNavigateTransfers: () => void;
}

export default function HomeScreen({ onLogout, onNavigatePayments, onNavigateTransfers }: HomeScreenProps) {
  const { profile, signOut } = useAuth();
  const [showBalance, setShowBalance] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-fawry-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-6 relative">
        <button 
          onClick={handleLogout}
          className="p-2 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all text-white border border-white/20"
        >
          <LogOut size={24} className="rotate-180" />
        </button>
        
        <FawryLogo size="sm" className="absolute left-1/2 -translate-x-1/2 scale-75" />
        
        <button className="p-2 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all text-white border border-white/20">
          <Menu size={24} />
        </button>
      </header>

      {/* Account Info Card Section */}
      <div className="px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#4d2673] rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          {/* Navigation Arrows */}
          <button className="absolute left-1 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1">
            <ChevronLeft size={28} />
          </button>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1">
            <ChevronRight size={28} />
          </button>

          <div className="flex flex-col gap-4 px-6">
            <div className="flex justify-between items-center border border-white/20 rounded-xl px-4 py-3 bg-white/5">
                <span className="text-white/60 text-sm">رقم الحساب</span>
                <span className="text-white font-mono text-lg tracking-wider">
                  {profile?.accountNumber || "----------"}
                </span>
            </div>

            <div className="flex items-center justify-between text-white/80 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-sm font-medium hover:text-white underline underline-offset-4"
                   >
                     {showBalance ? "إخفاء الرصيد" : "عرض الرصيد"}
                   </button>
                </div>
                <div className="flex items-center gap-1 font-mono tracking-tighter overflow-hidden h-7">
                    {showBalance ? (
                      <span className="text-white font-bold text-xl">
                        {(profile?.balance || 0).toLocaleString()} SDG
                      </span>
                    ) : (
                      <span className="text-white tracking-[0.2em]">****************</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
               <button className="bg-white text-fawry-dark rounded-lg py-2 px-1 text-[11px] font-bold hover:bg-white/90 transition-all">
                  كشف الحساب
               </button>
               <button className="bg-white text-fawry-dark rounded-lg py-2 px-1 text-[11px] font-bold hover:bg-white/90 transition-all">
                  تفاصيل الحساب
               </button>
               <button className="bg-white text-fawry-dark rounded-lg py-2 px-1 text-[11px] font-bold hover:bg-white/90 transition-all">
                  إنشاء رمز QR
               </button>
            </div>
          </div>
          
          <div className="flex justify-center gap-1.5 mt-6">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </div>

      {/* White Section */}
      <div className="flex-1 bg-white rounded-t-[45px] mt-4 p-8 flex flex-col items-center">
        {/* QR Pay Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-fawry-purple text-white w-full max-w-[200px] py-4 rounded-[40px] flex items-center justify-center gap-3 shadow-lg -mt-16 mb-12 border-4 border-white"
        >
          <div className="flex flex-col text-right">
             <span className="text-sm font-bold leading-tight">الدفع عبر</span>
             <span className="text-sm font-bold leading-tight">الـ QR</span>
          </div>
          <QrCode size={34} />
        </motion.button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-y-16 gap-x-12 w-full max-w-sm pt-4">
           <HomeActionItem 
             onClick={onNavigateTransfers}
             icon={
               <div className="relative">
                 <Repeat size={48} />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5">
                    <CircleDollarSign size={20} />
                 </div>
               </div>
             } 
             label="التحاويل" 
           />
           <HomeActionItem 
            onClick={onNavigatePayments}
            icon={
              <div className="relative">
                <FileText size={48} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-fawry-purple">
                   <CircleDollarSign size={20} />
                </div>
              </div>
            } 
            label="الدفعيات الإلكترونية" 
           />
           <HomeActionItem icon={<Settings size={48} />} label="إعدادات" />
           <HomeActionItem 
             icon={
               <div className="flex flex-col gap-1.5 py-2">
                 <div className="w-2.5 h-2.5 bg-fawry-purple rounded-full" />
                 <div className="w-2.5 h-2.5 bg-fawry-purple rounded-full opacity-70" />
                 <div className="w-2.5 h-2.5 bg-fawry-purple rounded-full opacity-40" />
               </div>
             } 
             label="المزيد" 
           />
        </div>
      </div>
    </div>
  );
}

function HomeActionItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="flex flex-col items-center gap-4 group"
    >
      <div className="text-fawry-purple transition-all group-hover:scale-110">
        {icon}
      </div>
      <span className="text-fawry-purple text-lg font-bold whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
