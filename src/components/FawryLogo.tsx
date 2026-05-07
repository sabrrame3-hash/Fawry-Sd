import { motion } from "motion/react";

interface FawryLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FawryLogo({ className = "", size = "md" }: FawryLogoProps) {
  const sizes = {
    sm: "scale-50",
    md: "scale-100",
    lg: "scale-150",
  };

  return (
    <div className={`flex items-center gap-1 ${sizes[size]} ${className}`} dir="rtl">
      {/* Icon Part: Arrow and Lines should be on the right in RTL */}
      <div className="flex items-center">
        {/* Double Arrow/Chevron */}
        <div className="relative w-12 h-12 ml-2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 15 L80 50 L10 85 L30 50 Z"
              className="fill-white"
            />
            <path
              d="M40 15 L95 50 L40 85 L55 50 Z"
              className="fill-white opacity-90"
            />
          </svg>
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-1.5 ml-2">
          <div className="h-1 w-6 bg-white rounded-full opacity-90" />
          <div className="h-1 w-8 bg-white rounded-full opacity-90" />
          <div className="h-1 w-7 bg-white rounded-full opacity-90" />
        </div>
      </div>

      {/* Text Part: Should be on the left in RTL */}
      <div className="flex flex-col items-center">
        <span className="text-white font-black text-5xl tracking-tighter leading-none" style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
          فوري
        </span>
      </div>
    </div>
  );
}
