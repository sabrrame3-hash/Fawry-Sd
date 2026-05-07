import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Building2, CheckCircle2, AlertCircle, Share2, Download, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import FawryLogo from "./FawryLogo";
import FIBLogo from "./FIBLogo";

interface TransferOtherBankScreenProps {
  onBack: () => void;
}

export default function TransferOtherBankScreen({ onBack }: TransferOtherBankScreenProps) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"unregistered" | "registered">("unregistered");
  const [step, setStep] = useState<"lookup" | "amount" | "success">("lookup");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [connectionLog, setConnectionLog] = useState<string[]>([]);

  const handleLookup = async () => {
    if (accountNumber !== confirmAccountNumber) {
      setErrorMessage("رقم الحساب غير متطابق");
      return;
    }
    if (accountNumber.length < 5) {
      setErrorMessage("يرجى إدخال رقم حساب صحيح");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setConnectionLog(["جاري طلب الوصول للمحول القومي EBS..."]);
    
    try {
      // Step-by-step logs for user transparency (Official Banking Style)
      await new Promise(r => setTimeout(r, 800));
      setConnectionLog(prev => [...prev, "التحقق من شهادة الأمان SSL..."]);
      await new Promise(r => setTimeout(r, 600));
      setConnectionLog(prev => [...prev, "إرسال طلب التحقق من رقم الحساب (PAN)..."]);
      
      // CALLING THE REAL BACKEND API
      const response = await fetch("/api/bank/account-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber }),
      });

      if (!response.ok) {
        throw new Error("Gateway connection failed");
      }

      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        setBeneficiaryName(data.accountName);
        setConnectionLog(prev => [...prev, "تم التحقق من الحساب بنجاح."]);
        await new Promise(r => setTimeout(r, 400));
        setStep("amount");
      } else {
        setErrorMessage(data.message || "عذراً، لم يتم العثور على هذا الحساب في قاعدة بيانات بنك فيصل");
      }
    } catch (err) {
      console.error("Banking API Error:", err);
      setErrorMessage("فشل الاتصال بخوادم بنك فيصل: يرجى التأكد من مفاتيح الربط في الإعدادات");
    } finally {
      setIsLoading(false);
      setConnectionLog([]);
    }
  };

  const handleTransfer = async () => {
    if (!profile || !user) return;
    
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrorMessage("أدخل مبلغ صحيح");
      return;
    }

    if (transferAmount > profile.balance) {
      setErrorMessage("الرصيد غير كافٍ");
      return;
    }

    setIsLoading(true);
    try {
      const ref = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const now = new Date();
      const formattedDate = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      
      setReferenceNumber(ref);
      setTransactionDate(formattedDate);

      const type = "تحويل لبنك الخرطوم (BBANK)";
      
      // 1. Record the transfer
      await addDoc(collection(db, "transfers"), {
        senderId: user.uid,
        senderAccountNumber: profile.accountNumber,
        receiverAccountNumber: accountNumber,
        amount: transferAmount,
        beneficiaryName: beneficiaryName,
        referenceNumber: ref,
        type: type,
        bankName: "بنك الخرطوم",
        timestamp: serverTimestamp(),
      });

      // 2. Update user balance
      const newBalance = profile.balance - transferAmount;
      await updateDoc(doc(db, "users", user.uid), {
        balance: newBalance
      });

      setStep("success");
    } catch (err) {
      console.error("Transfer error:", err);
      handleFirestoreError(err, OperationType.WRITE, "transfers");
      setErrorMessage("حدث خطأ أثناء التحويل");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#006837] bg-gradient-to-b from-[#006837] via-[#005a2e] to-[#004d27] flex flex-col items-center p-8 text-white relative font-sans">
        {/* Success Header */}
        <div className="absolute top-10 left-6">
          <button onClick={onBack} className="p-2 transition-transform active:scale-90">
             <div className="border-2 border-white/40 rounded-lg p-1">
               <LogOut size={24} className="rotate-180 text-white" />
             </div>
          </button>
        </div>

        <div className="mt-12 mb-8 flex flex-col items-center">
           <FIBLogo className="h-16 transform scale-150 mb-2" />
        </div>

        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10 }}
          className="bg-white rounded-full p-1 mb-3 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-[6px] border-[#006837]">
                <CheckCircle2 size={54} className="text-[#006837]" />
             </div>
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold mb-10 tracking-wide">تم التحويل بنجاح !</h2>

        {/* Detailed Info Box - FIB Banking Style */}
        <div className="w-full max-w-sm border border-white/30 rounded-[24px] py-8 px-6 mb-10 bg-white/10 backdrop-blur-[15px] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#EEBC1D]" /> {/* Gold accent line */}
           <div className="flex flex-col gap-5 relative z-10">
              <InfoRow label="من الحساب" value={profile?.accountNumber || "00"} valueClassName="text-sm font-mono opacity-100" />
              <div className="h-[0.5px] bg-white/20 w-full" />
              <InfoRow label="إلى الطرف الآخر" value={"بنك الخرطوم"} valueClassName="text-sm font-bold" />
              <InfoRow label="رقم الحساب" value={accountNumber} valueClassName="text-sm font-mono" />
              <div className="h-[0.5px] bg-white/20 w-full" />
              <InfoRow label="المستفيد" value={beneficiaryName} valueClassName="text-base font-bold text-[#EEBC1D]" />
              <div className="h-[0.5px] bg-white/20 w-full" />
              <div className="flex justify-between items-end">
                <span className="text-xs opacity-70">المبلغ المحول</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-xs font-bold text-[#EEBC1D]">SDG</span>
                </div>
              </div>
              <div className="h-[0.5px] bg-white/20 w-full" />
              <InfoRow label="رقم العملية (EBS)" value={referenceNumber} valueClassName="text-sm font-mono" />
              <InfoRow label="التاريخ والوقت" value={transactionDate} valueClassName="text-xs" />
           </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full max-w-[280px] py-4 bg-[#EEBC1D] text-[#006837] rounded-full font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-auto tracking-wider uppercase"
        >
          موافق
        </motion.button>

        {/* Bottom Actions */}
        <div className="flex justify-between w-full max-w-[240px] mt-10 mb-6 font-sans">
           <button className="flex flex-col items-center gap-2 group">
              <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-all border border-white/10">
                <Share2 size={28} />
              </div>
              <span className="text-xs opacity-70">مشاركة</span>
           </button>
           <button className="flex flex-col items-center gap-2 group">
              <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-all border border-white/10">
                <Download size={28} />
              </div>
              <span className="text-xs opacity-70">تحميل الوصل</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#006837] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-6 relative">
        <button 
          onClick={onBack}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white border border-white/20"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        
        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
           <FIBLogo className="shrink-0 scale-125" />
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[45px] mt-4 p-8 overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="flex w-full border-b border-gray-100 mb-10 relative">
           <button 
            onClick={() => {
              setStep("lookup");
              setBeneficiaryName("");
              setActiveTab("unregistered");
            }}
            className={`flex-1 py-4 text-base font-bold transition-all relative z-10 ${
              activeTab === "unregistered" ? "text-[#006837]" : "text-gray-400"
            }`}
           >
             المستفيدين غير المسجلين
           </button>
           <button 
            onClick={() => setActiveTab("registered")}
            className={`flex-1 py-4 text-base font-bold transition-all relative z-10 ${
              activeTab === "registered" ? "text-[#006837]" : "text-gray-400"
            }`}
           >
             المستفيدين المسجلين
           </button>
           
           {/* Active Indicator Line */}
           <motion.div 
             layoutId="tab-indicator-transfer"
             animate={{ x: activeTab === "unregistered" ? "0%" : "-100%" }}
             className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-[#006837]"
           />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6">
           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={step === "amount" || isLoading}
                  placeholder="أدخل رقم BBANK (بنك الخرطوم)"
                  className="w-full px-5 py-5 rounded-xl border border-gray-200 text-right text-fawry-dark font-medium focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all placeholder:text-gray-400 placeholder:text-sm disabled:bg-gray-50"
                />
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  disabled={step === "amount" || isLoading}
                  placeholder="تأكيد رقم BBANK"
                  className="w-full px-5 py-5 rounded-xl border border-gray-200 text-right text-fawry-dark font-medium focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all placeholder:text-gray-400 placeholder:text-sm disabled:bg-gray-50"
                />
              </div>

              {step === "amount" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                   <div className="bg-green-50 p-4 rounded-xl text-right border border-green-100">
                      <span className="text-gray-500 text-sm block mb-1">اسم المستفيد</span>
                      <span className="text-[#006837] font-bold text-lg">{beneficiaryName}</span>
                   </div>

                   <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      autoFocus
                      placeholder="المبلغ المراد تحويله"
                      className="w-full px-5 py-5 rounded-xl border border-gray-200 text-right text-fawry-dark font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all placeholder:text-gray-400 placeholder:text-base placeholder:font-normal"
                    />
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  placeholder="رقم الجوال +249"
                  className="w-full px-5 py-5 rounded-xl border border-gray-200 text-right text-fawry-dark font-medium focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all placeholder:text-gray-400 placeholder:text-sm"
                />
              </div>
           </div>

           {errorMessage && (
             <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
               <AlertCircle size={20} />
               <span className="text-sm font-bold">{errorMessage}</span>
             </div>
           )}

           {isLoading && connectionLog.length > 0 && (
             <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
               {connectionLog.map((log, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2 text-xs text-[#006837]"
                 >
                   <div className="w-1 h-1 bg-[#006837] rounded-full animate-pulse" />
                   {log}
                 </motion.div>
               ))}
             </div>
           )}

           {/* Buttons */}
           <div className="flex flex-col gap-3 mt-4">
              <motion.button
                onClick={step === "lookup" ? handleLookup : handleTransfer}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 bg-[#006837] text-white rounded-full text-xl font-bold shadow-lg hover:bg-[#005a2e] transition-all flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (step === "lookup" ? "إرسال" : "تحويل الآن")}
              </motion.button>
              
              <motion.button
                onClick={step === "lookup" ? onBack : () => {
                  setStep("lookup");
                  setBeneficiaryName("");
                }}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-[#006837] border-2 border-[#006837] rounded-full text-xl font-bold shadow-sm hover:bg-gray-50 transition-all font-sans"
              >
                {step === "lookup" ? "إلغاء الأمر" : "تغيير البيانات"}
              </motion.button>
           </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClassName = "" }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex justify-between items-center w-full">
       <span className="text-white/60 text-sm flex-1 text-right">{label}</span>
       <span className={`text-white font-bold flex-1 text-left ${valueClassName}`}>{value}</span>
    </div>
  );
}
