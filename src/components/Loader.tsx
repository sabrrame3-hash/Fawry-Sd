import { motion } from "motion/react";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1000]">
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
  );
}
