import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("novahub_splash_seen");
    if (!hasSeen) {
      setShowSplash(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem("novahub_splash_seen", "true");
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
              className="relative rounded-3xl p-4"
            >
              <motion.img
                src="/novahub-wordmark.png"
                alt="NovaHub"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="w-64 md:w-80 drop-shadow-2xl"
              />
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
