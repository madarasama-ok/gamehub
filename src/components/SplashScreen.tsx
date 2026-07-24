import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("legendleo_splash_seen");
    if (!hasSeen) {
      setShowSplash(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem("legendleo_splash_seen", "true");
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                boxShadow: ["0 0 0px hsl(var(--primary)/0)", "0 0 80px hsl(var(--primary)/0.5)", "0 0 0px hsl(var(--primary)/0)"] 
              }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="relative rounded-full p-8"
            >
              <div className="flex items-center gap-4 text-6xl md:text-7xl">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="drop-shadow-2xl"
                >
                  👑
                </motion.span>
                <div className="flex overflow-hidden">
                  {"LEGENDLEO".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                      className="font-extrabold tracking-tighter text-white text-glow"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 1.5, duration: 0.5 }}
              onAnimationComplete={() => setTimeout(handleAnimationComplete, 200)}
              className="h-1 bg-primary mt-8 rounded-full glow-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!showSplash && children}
    </>
  );
}