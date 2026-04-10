import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWalkthrough } from "../context/WalkthroughContext";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";

// --- Sleek Hand Pointer (Professional cursor style) ---
function HandPointer({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      style={style}
      className="absolute z-[10001] pointer-events-none select-none flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      {/* Ripple Pulse */}
      <motion.div
        className="absolute w-12 h-12 rounded-full border border-[#F77F00]/30 bg-[#F77F00]/5"
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Professional Hand Icon */}
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M7 11V5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5V11M11 11V5C11 3.89543 11.8954 3 13 3C14.1046 3 15 3.89543 15 5V11M15 11V7C15 5.89543 15.8954 5 17 5C18.1046 5 19 5.89543 19 7V13C19 17.4183 15.4183 21 11 21C6.58172 21 3 17.4183 3 13V12.4142C3 11.8838 3.21071 11.3751 3.58579 11L5.41421 9.17157C5.78929 8.7965 6.29799 8.58579 6.82843 8.58579C7.933 8.58579 8.82843 9.48122 8.82843 10.5858V11" 
          stroke="#F77F00" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="rgba(247,127,0,0.1)"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        />
      </svg>
    </motion.div>
  );
}

export function Walkthrough() {
  const { currentStepData, skipWalkthrough, steps, currentStep, isActive } = useWalkthrough();
  const { t } = useApp();
  const [spotStyle, setSpotStyle] = useState<{ left: number, top: number, width: number, height: number } | null>(null);

  // Optimized Measurement: No requestAnimationFrame
  const measure = useCallback(() => {
    if (!currentStepData || !isActive) {
      setSpotStyle(null);
      return;
    }

    const el = document.getElementById(currentStepData.targetId);
    const container = document.getElementById("mobile-container");
    
    if (el && container) {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const pad = 6;
      setSpotStyle({
        left: rect.left - containerRect.left - pad,
        top: rect.top - containerRect.top - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      });
    } else {
      setSpotStyle(null);
    }
  }, [currentStepData, isActive]);

  // Re-measure on key events only
  useEffect(() => {
    if (!isActive) return;
    
    // Initial measure with a slight delay to allow layout to settle
    const timer = setTimeout(measure, 100);
    
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [measure, isActive, currentStep]);

  if (!isActive || !currentStepData || !spotStyle) return null;

  const isBottomNav = currentStepData.targetId.includes("tour-home") || 
                     currentStepData.targetId.includes("tour-practice") || 
                     currentStepData.targetId.includes("tour-detect") || 
                     currentStepData.targetId.includes("tour-progress") || 
                     currentStepData.targetId.includes("tour-community-siren");

  const tooltipAbove = spotStyle.top + spotStyle.height > 600; 
  const orbX = spotStyle.left + spotStyle.width / 2;
  const orbY = spotStyle.top + spotStyle.height / 2;

  return (
    <AnimatePresence>
      <motion.div
        key={`walkthrough-${currentStep}`}
        className="absolute inset-0 z-[9998] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <svg className="absolute inset-0 w-full h-full z-[9998] pointer-events-none">
          <defs>
            <mask id="spotlight-mask-final">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={spotStyle.left}
                y={spotStyle.top}
                width={spotStyle.width}
                height={spotStyle.height}
                fill="black"
                rx={isBottomNav ? 14 : 20}
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.45)"
            mask="url(#spotlight-mask-final)"
            className="backdrop-blur-[2px]"
          />
        </svg>

        {/* Highlight Ring */}
        <motion.div
          className="absolute z-[9999] pointer-events-none border border-[#F77F00]/50"
          style={{
            left: spotStyle.left - 1,
            top: spotStyle.top - 1,
            width: spotStyle.width + 2,
            height: spotStyle.height + 2,
            borderRadius: isBottomNav ? 14 : 20,
            boxShadow: "0 0 10px rgba(247,127,0,0.3)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Hand Pointer */}
        <HandPointer style={{ left: orbX - 20, top: orbY - 20 }} />

        {/* Glassmorphic Tooltip */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: tooltipAbove ? 10 : -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="absolute z-[10002] left-6 right-6 pointer-events-auto flex justify-center"
          style={{
            top: tooltipAbove ? "auto" : spotStyle.top + spotStyle.height + 35,
            bottom: tooltipAbove ? (window.innerHeight - spotStyle.top) + 25 : "auto", 
          }}
        >
          <div className="relative max-w-[280px] w-full">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] rounded-2xl border border-white/20 shadow-2xl" />
            <div className="relative p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-white font-bold text-sm tracking-wide">
                  {t(currentStepData.titleKey)}
                </h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); skipWalkthrough(); }} 
                  className="p-1 text-white/40 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-white/80 text-[13px] leading-tight font-medium">
                {t(currentStepData.descKey)}
              </p>
              <div className="mt-3 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#F77F00]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
