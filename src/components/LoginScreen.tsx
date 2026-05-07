import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, MessageCircle, Instagram, Facebook, Headphones } from "lucide-react";
import FawryLogo from "./FawryLogo";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const triggerComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (error) {
      console.error("Login Error:", error);
      setIsLoading(false);
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen fawry-gradient flex flex-col items-center justify-between py-12 px-6 overflow-hidden relative">
      <div className="w-full flex flex-col items-center gap-12 mt-8">
        <FawryLogo size="lg" />

        <div className="relative w-full max-w-sm">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-full bg-white rounded-[40px] p-8 shadow-2xl flex flex-col gap-6 transition-all duration-300 ${isLoading ? 'brightness-75' : ''}`}
          >
            <h2 className="text-[#800080] text-3xl font-bold text-center mb-2 font-sans">مرحباً !</h2>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="الرقم البنكي الموحد"
                  defaultValue="51645453"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 text-right text-[#800080] font-bold focus:outline-none focus:ring-2 focus:ring-fawry-magenta transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز المرور"
                  defaultValue="1234"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 text-right text-[#800080] font-bold focus:outline-none focus:ring-2 focus:ring-fawry-magenta transition-all placeholder:text-gray-400 pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 bg-[#6c3a6c] hover:bg-[#5a305a] text-white rounded-xl font-bold text-xl shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              تسجيل الدخول
            </button>
          </motion.div>

          {/* Loading Spinner Over Card */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative w-16 h-16">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-white rounded-full"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.125,
                    }}
                    style={{
                      top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                      left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm flex justify-between px-4">
          <button className="text-white text-sm font-medium border-b border-transparent hover:border-white pb-0.5">
            فتح حساب جديد
          </button>
          <button 
            onClick={triggerComingSoon}
            className="text-white text-sm font-medium border-b border-transparent hover:border-white pb-0.5"
          >
            هل نسيت رمز المرور؟
          </button>
        </div>
      </div>

      {/* Error Dialog */}
      {showError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden flex flex-col items-center"
          >
            <div className="w-full py-6 px-4 text-center">
               <h3 className="text-black text-2xl font-black">فوري السودان</h3>
            </div>
            
            <div className="w-full h-[1px] bg-purple-500/30" />

            <div className="py-10 px-8 text-center">
               <p className="text-[#333] text-lg font-bold leading-relaxed">
                 Invalid Source. Please contact Customer Care
               </p>
            </div>

            <div className="w-full px-8 pb-8">
              <button 
                onClick={() => {
                  setShowError(false);
                  onLogin(); // Proceed to home after error for demo purposes
                }}
                className="w-full py-3 bg-[#800080] text-white rounded-full text-xl font-bold shadow-lg hover:bg-[#6c006c] active:scale-95 transition-all"
              >
                نعم
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coming Soon Toast */}
      {showComingSoon && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 bg-[#333333] border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl z-[60]"
        >
           <div className="bg-[#4a0072] w-8 h-8 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M2 12L22 2L15 12L22 22L2 12Z" />
              </svg>
           </div>
           <span className="text-white text-xl font-bold">قريباً...</span>
        </motion.div>
      )}

      <div className="flex items-center gap-8 text-white opacity-90 mb-4">
        <MessageCircle size={32} className="cursor-pointer hover:scale-110 transition-all" />
        <Instagram size={32} className="cursor-pointer hover:scale-110 transition-all" />
        <Facebook size={32} className="cursor-pointer hover:scale-110 transition-all" />
        <Headphones size={32} className="cursor-pointer hover:scale-110 transition-all" />
      </div>
    </div>
  );
}
