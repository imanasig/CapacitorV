import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import { 
  Download, Star, Search, Mic, ArrowLeft, MoreVertical, 
  Menu, Bell, User, LayoutGrid, CheckCircle2, ShoppingCart,
  Clock, MapPin, ChevronRight, Play, Check, Camera, MessageSquare, Phone as PhoneIcon,
  Plus, Tag, ShoppingBag, Info, X, ArrowUpLeft, ArrowUp, Delete, Smile
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SimulationStage = 
  | "HOME" 
  | "PS_HOME" 
  | "PS_SEARCH" 
  | "PS_APP" 
  | "PS_INSTALLING" 
  | "PS_OPEN" 
  | "BLINKIT_SPLASH"
  | "BLINKIT_APP";

export function InstallApp() {
  const { t, markCompleted } = useApp();
  const [stage, setStage] = useState<SimulationStage>("HOME");
  const [searchQuery, setSearchQuery] = useState("");
  const [installProgress, setInstallProgress] = useState(0);
  const [showMicOverlay, setShowMicOverlay] = useState(false);

  // Handle auto-transitions and simulations
  useEffect(() => {
    if (stage === "PS_INSTALLING") {
      const interval = setInterval(() => {
        setInstallProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage("PS_OPEN");
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }


  }, [stage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleMicClick = () => {
    setShowMicOverlay(true);
    setTimeout(() => {
      setShowMicOverlay(false);
      setSearchQuery("Blinkit");
      setStage("PS_APP");
    }, 2000);
  };

  const renderStageContent = () => {
    switch (stage) {
      case "HOME":
        return (
          <div className="relative w-full aspect-[9/16] bg-[#0A043C] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] ring-4 ring-black/5">
            {/* Realistic Wallpaper */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
            
            {/* Status Bar */}
            <div className="relative h-7 w-full flex justify-between px-8 pt-3 text-white text-[11px] font-bold z-10">
              <span>10:09</span>
              <div className="flex gap-2 items-center">
                <Tag size={10} className="rotate-90" />
                <span>88%</span>
              </div>
            </div>
            
            {/* App Grid */}
            <div className="relative p-8 pt-12 grid grid-cols-4 gap-y-8 gap-x-4 z-10">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 bg-green-500 rounded-2xl shadow-xl flex items-center justify-center text-white">
                  <PhoneIcon size={28} />
                </div>
                <span className="text-[10px] text-white font-black tracking-tight shadow-sm">Phone</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl shadow-xl flex items-center justify-center text-white">
                  <MessageSquare size={28} />
                </div>
                <span className="text-[10px] text-white font-black tracking-tight shadow-sm">Messages</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setStage("PS_HOME")}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/20">
                   <div className="relative w-full h-full flex items-center justify-center flex-col bg-gradient-to-tr from-blue-50 to-white">
                      <div className="text-[#4285F4] font-black text-xl italic leading-none">P</div>
                      <div className="flex gap-0.5 -mt-0.5">
                        <div className="w-1.5 h-1.5 bg-[#EA4335] rounded-full" />
                        <div className="w-1.5 h-1.5 bg-[#4285F4] rounded-full" />
                        <div className="w-1.5 h-1.5 bg-[#FBBC05] rounded-full" />
                      </div>
                   </div>
                </div>
                <span className="text-[10px] text-white font-black tracking-tight shadow-sm">{t("playStore")}</span>
              </motion.button>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center text-white">
                  <Camera size={28} />
                </div>
                <span className="text-[10px] text-white font-black tracking-tight shadow-sm">Camera</span>
              </div>
            </div>

            <div className="absolute bottom-20 inset-x-0 flex flex-col items-center z-10">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 text-white text-center shadow-2xl"
              >
                <p className="text-sm font-black italic tracking-tight">{t("tapPlayStoreIcon")}</p>
                <div className="mt-2 flex justify-center">
                  <Play size={16} className="text-white fill-white rotate-90" />
                </div>
              </motion.div>
            </div>
          </div>
        );

      case "PS_HOME":
        return (
          <div className="relative w-full aspect-[9/16] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col">
            {/* Play Store Search Bar */}
            <div className="p-4 pt-10 px-6">
              <motion.div 
                onClick={() => setStage("PS_SEARCH")}
                className="flex items-center gap-3 bg-slate-100/80 px-5 py-4 rounded-3xl shadow-inner cursor-pointer border border-slate-200/50"
              >
                <Menu size={22} className="text-slate-500" />
                <span className="text-slate-500 font-bold text-sm flex-1">{t("searchApps")}</span>
                <Mic size={22} className="text-slate-500" />
                <div className="w-8 h-8 bg-[#03506F] rounded-full flex items-center justify-center text-white text-xs font-black">S</div>
              </motion.div>
            </div>

            {/* Realistic Categories */}
            <div className="px-6 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <div className="flex gap-4">
                {["For you", "Top charts", "Events", "Premium", "Categories"].map((cat, i) => (
                  <span key={cat} className={`text-sm font-black pb-2 px-1 ${i === 0 ? "text-green-700 border-b-4 border-green-700" : "text-slate-500"}`}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Content */}
            <div className="p-6 space-y-8 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-[#0A043C] text-lg">Recommended for you</h3>
                <ChevronRight size={22} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: "Instagram", icon: <Camera size={28} className="text-pink-500" />, color: "bg-pink-50" },
                  { name: "Snapchat", icon: "👻", color: "bg-yellow-50" },
                  { name: "Messenger", icon: <MessageSquare size={28} className="text-blue-500" />, color: "bg-blue-50" }
                ].map(app => (
                  <div key={app.name} className="flex flex-col gap-2">
                    <div className={`aspect-square ${app.color} rounded-[28px] flex items-center justify-center text-4xl shadow-sm border border-slate-100`}>
                      {app.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-700 text-center truncate">{app.name}</span>
                  </div>
                ))}
              </div>

              {/* Promo Banner */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setStage("PS_SEARCH")}
                className="bg-[#FCD303]/10 p-5 rounded-[32px] border-2 border-[#FCD303]/50 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#FCD303] rounded-full opacity-10 group-hover:scale-150 transition-transform" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 bg-[#FCD303] rounded-2xl flex flex-col items-center justify-center shadow-md border-2 border-white relative overflow-hidden">
                    <div className="font-black text-slate-900 text-[10px] leading-none tracking-tighter">blinkit</div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0A043C]">Blinkit: Grocery in 10 mins</p>
                    <p className="text-[11px] font-bold text-slate-500 italic">Sponsored · Essential Services</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-6 bg-green-700 text-white text-center font-black text-sm uppercase tracking-widest">
              {t("typeBlinkitInSearch")}
            </div>
          </div>
        );

      case "PS_SEARCH":
        return (
          <div className="relative w-full aspect-[9/16] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col tracking-tight">
            <div className="p-3 pt-6 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
              <ArrowLeft size={20} className="text-slate-600 shrink-0" onClick={() => setStage("PS_HOME")} />
              <div className="flex-1 bg-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-slate-200">
                <input 
                  autoFocus
                  placeholder={t("searchApps")}
                  className="bg-transparent text-sm w-full outline-none font-bold text-slate-800"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchQuery && <X size={16} className="text-slate-400" onClick={() => setSearchQuery("")} />}
              </div>
              <Mic 
                size={20} 
                className={`shrink-0 transition-all ${showMicOverlay ? "text-red-500 scale-125" : "text-slate-600 active:scale-90"}`} 
                onClick={handleMicClick}
              />
            </div>

            <div className="p-2 space-y-1 flex-1 overflow-y-auto min-h-[40px]">
              <motion.div 
                whileTap={{ backgroundColor: "#F8FAFC" }}
                className="flex items-center gap-4 py-2 px-2 rounded-lg cursor-pointer bg-slate-50/50"
                onClick={() => { setSearchQuery("Blinkit"); setStage("PS_APP"); }}
              >
                <div className="w-6 h-6 rounded bg-[#FCD303] flex items-center justify-center text-[10px] font-black border border-slate-100 shadow-sm leading-none pt-0.5">b</div>
                <div className="flex-1">
                   <span className="text-[13px] font-black text-slate-700 tracking-tight leading-none block">blinkit</span>
                   <p className="text-[9px] font-bold text-slate-400 leading-tight">Grocery in 10 minutes</p>
                </div>
                <ArrowUpLeft size={14} className="text-slate-300 shrink-0" />
              </motion.div>
              
              <div className="flex items-center gap-4 py-1.5 px-2 opacity-50">
                <div className="w-6 h-6 rounded bg-pink-50 flex items-center justify-center text-pink-500 border border-slate-100"><Camera size={14} /></div>
                <div className="flex-1">
                   <span className="text-[13px] font-black text-slate-700 leading-none block">instagram</span>
                   <p className="text-[9px] font-bold text-slate-400 leading-tight">Photos & Videos</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-1.5 px-2 opacity-50">
                <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center text-green-500 border border-slate-100"><MessageSquare size={14} /></div>
                <div className="flex-1">
                   <span className="text-[13px] font-black text-slate-700 leading-none block">whatsapp</span>
                   <p className="text-[9px] font-bold text-slate-400 leading-tight">Messenger & Calls</p>
                </div>
              </div>
            </div>

            {/* Keyboard Mockup - iOS Exact Replica Scale Down */}
            <div className="mt-auto bg-[#D1D3D9] pb-3 pt-1.5 flex flex-col gap-1.5 shrink-0">
              {/* Row 1 */}
              <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
                {"QWERTYUIOP".split("").map(l => (
                  <button key={l} onClick={() => handleSearchChange(searchQuery + l)} className="flex-1 h-7 sm:h-8 bg-[#FCFCFE] rounded-[4px] text-[12px] sm:text-[14px] font-medium text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 px-0 min-w-0 flex items-center justify-center">{l}</button>
                ))}
              </div>
              
              {/* Row 2 */}
              <div className="flex justify-center w-[98%] mx-auto gap-[2px]">
                <div className="w-[4.5%]" />
                {"ASDFGHJKL".split("").map(l => (
                  <button key={l} onClick={() => handleSearchChange(searchQuery + l)} className="flex-[10] h-7 sm:h-8 bg-[#FCFCFE] rounded-[4px] text-[12px] sm:text-[14px] font-medium text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 px-0 min-w-0 flex items-center justify-center">{l}</button>
                ))}
                <div className="w-[4.5%]" />
              </div>
              
              {/* Row 3 */}
              <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
                <button className="flex-[12.5] h-7 sm:h-8 bg-[#B3B7BD] rounded-[4px] flex items-center justify-center text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)]"><ArrowUp size={14} strokeWidth={3} className="text-slate-800" /></button>
                {"ZXCVBNM".split("").map(l => (
                  <button key={l} onClick={() => handleSearchChange(searchQuery + l)} className="flex-[10] h-7 sm:h-8 bg-[#FCFCFE] rounded-[4px] text-[12px] sm:text-[14px] font-medium text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 px-0 min-w-0 flex items-center justify-center">{l}</button>
                ))}
                <button onClick={() => handleSearchChange(searchQuery.slice(0, -1))} className="flex-[12.5] h-7 sm:h-8 bg-[#B3B7BD] rounded-[4px] flex items-center justify-center text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#FCFCFE] transition-colors"><Delete size={14} strokeWidth={2.5} /></button>
              </div>
              
              {/* Row 4 */}
              <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
                <button className="flex-[22] h-7 sm:h-8 bg-[#B3B7BD] rounded-[4px] text-[11px] sm:text-[12px] font-normal tracking-wide text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)]">123</button>
                <button onClick={() => handleSearchChange(searchQuery + " ")} className="flex-[56] h-7 sm:h-8 bg-[#FCFCFE] rounded-[4px] text-xs font-normal text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors">space</button>
                <button 
                  onClick={() => { setSearchQuery("Blinkit"); setStage("PS_APP"); }}
                  className="flex-[22] h-7 sm:h-8 bg-[#B3B7BD] rounded-[4px] text-slate-600 text-[11px] sm:text-[12px] font-normal tracking-wide shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-blue-600 active:text-white transition-colors"
                >
                  return
                </button>
              </div>

              {/* Bottom Utility Bar */}
              <div className="flex items-center justify-between px-3 pt-0.5 text-[#464A53]">
                <Smile size={18} strokeWidth={1.5} />
                <Mic size={18} strokeWidth={1.5} onClick={handleMicClick} />
              </div>
              
              {/* Home indicator (iPhone notch) */}
              <div className="w-[30%] h-[3px] rounded-full bg-slate-900 mx-auto" />
            </div>

            <AnimatePresence>
              {showMicOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 z-50 p-12 text-center"
                >
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-50">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl"
                    >
                      <Mic size={32} />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-[1000] tracking-tighter mb-2">Listening...</h2>
                  <p className="text-slate-400 font-bold italic">Try saying "Blinkit"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "PS_APP":
      case "PS_INSTALLING":
      case "PS_OPEN":
        return (
          <div className="relative w-full aspect-[9/16] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col">
            <div className="p-4 pt-10 flex items-center justify-between px-6">
              <ArrowLeft size={24} className="text-slate-600" onClick={() => setStage("PS_HOME")} />
              <div className="flex gap-6">
                <Search size={24} className="text-slate-600" />
                <MoreVertical size={24} className="text-slate-600" />
              </div>
            </div>

            <div className="p-8 flex gap-6">
              <div className="w-24 h-24 bg-[#FCD303] rounded-[32px] flex flex-col items-center justify-center shadow-xl border-4 border-white ring-2 ring-[#FCD303]/20 relative overflow-hidden">
                 <div className="font-black text-slate-900 text-[18px] leading-none tracking-tighter">blinkit</div>
                 <div className="absolute right-0 bottom-0 w-8 h-8 bg-black/5 rounded-tl-[16px]" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter leading-tight">{t("blinkit")}</h2>
                <p className="text-sm text-green-700 font-black tracking-tight">{t("blinkitDeveloper")}</p>
                <div className="flex items-center gap-1 mt-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("verifiedMerchant")}</p>
                   <CheckCircle2 size={12} className="text-blue-500 fill-blue-500" />
                </div>
              </div>
            </div>

            <div className="px-8 flex items-center gap-2 mb-6">
              <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100 uppercase">Top 1 Free</div>
              <div className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-full border border-slate-100 uppercase">Shopping</div>
            </div>

            <div className="px-8 flex justify-between border-y border-slate-50 py-4 mb-8">
              <div className="text-center">
                <div className="flex items-center gap-1 font-black text-slate-900 justify-center">
                  <span className="text-base">4.6</span><Star size={14} className="fill-slate-900" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">1.2M reviews</p>
              </div>
              <div className="w-[1px] bg-slate-100" />
              <div className="text-center">
                <p className="font-black text-slate-900 text-base">500M+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Downloads</p>
              </div>
              <div className="w-[1px] bg-slate-100" />
              <div className="text-center">
                <div className="w-5 h-5 rounded-md border-2 border-slate-900 flex items-center justify-center text-[9px] font-black mx-auto mb-0.5">3+</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rated 3+</p>
              </div>
            </div>

            <div className="px-8 space-y-4">
              {stage === "PS_APP" ? (
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStage("PS_INSTALLING")}
                  className="w-full bg-green-700 text-white font-[1000] py-4 rounded-2xl shadow-xl shadow-green-700/20 text-base tracking-tight"
                >
                  {t("install")}
                </motion.button>
              ) : stage === "PS_INSTALLING" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-lg font-[1000] text-slate-900 leading-none">{installProgress}%</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Installing...</span>
                    </div>
                    <span className="text-xs font-black text-slate-600 italic">18.42 MB</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      className="h-full bg-green-600 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${installProgress}%` }}
                    />
                  </div>
                  <button className="w-full border-2 border-slate-100 text-slate-400 font-black py-3 rounded-2xl text-xs uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                   <button className="flex-1 border-2 border-slate-100 text-slate-300 font-black py-4 rounded-2xl text-sm uppercase">
                    Uninstall
                  </button>
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStage("BLINKIT_SPLASH")}
                    className="flex-1 bg-green-700 text-white font-[1000] py-4 rounded-2xl shadow-xl shadow-green-700/20 text-base"
                  >
                    {t("open")}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        );

      case "BLINKIT_SPLASH":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full aspect-[9/16] bg-[#FCD303] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col items-center justify-center p-12"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="font-[1000] text-slate-900 text-6xl tracking-tighter leading-none mb-2">blinkit</div>
              <p className="text-slate-900 font-black text-xs tracking-tight">India's Last Minute App</p>
            </div>
            
            <div className="absolute bottom-16 text-center">
              <p className="text-slate-900/40 font-bold text-[10px] tracking-[0.3em] uppercase">An Eternal Company</p>
            </div>
          </motion.div>
        );

      case "BLINKIT_APP":
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full aspect-[9/16] bg-[#FCD303] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col"
          >
            {/* Real Blinkit UI Header */}
            <div className="p-6 pt-12 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 bg-white rounded-[24px] flex flex-col items-center justify-center shadow-2xl border-4 border-white ring-2 ring-black/5">
                    <div className="font-[1000] text-slate-900 text-[14px] leading-none tracking-tighter">blinkit</div>
                 </div>
                 <div className="flex gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-xl rounded-full text-slate-900 border border-white/20 shadow-sm"><Search size={22} /></div>
                    <div className="p-3 bg-white/20 backdrop-blur-xl rounded-full text-slate-900 border border-white/20 shadow-sm"><User size={22} /></div>
                 </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[32px] shadow-xl flex items-center gap-4 border border-white">
                <div className="bg-red-500 p-2.5 rounded-2xl text-white shadow-lg shadow-red-500/30"><MapPin size={22} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.2em] leading-none">Delivering to</p>
                    <div className="flex gap-1">
                       <div className="w-1 h-1 bg-green-500 rounded-full" />
                       <div className="w-1 h-1 bg-green-500 rounded-full opacity-30" />
                    </div>
                  </div>
                  <p className="text-sm font-[1000] text-slate-900 tracking-tight mt-1 truncate">Hiranandani Estate, Thane... ⌵</p>
                </div>
              </div>
            </div>

            {/* Main Shopping Area */}
            <div className="flex-1 bg-slate-50/80 backdrop-blur-sm rounded-t-[48px] px-6 pt-10 space-y-8 relative shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
              {/* Delivery Banner */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white p-5 rounded-[32px] shadow-lg border border-slate-100 flex items-center gap-5 relative overflow-hidden group"
              >
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-[#FCD303] opacity-10 skew-x-[20deg] translate-x-8" />
                <div className="bg-[#FCD303] p-4 rounded-2xl text-slate-900 shadow-xl shadow-[#FCD303]/20"><Clock size={28} /></div>
                <div>
                   <h3 className="text-lg font-[1000] text-slate-900 tracking-tighter italic">10 MINS</h3>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("blinkitTagline")}</p>
                </div>
                <div className="ml-auto bg-slate-50 p-2 rounded-full text-slate-300"><ChevronRight size={20} /></div>
              </motion.div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                {[
                  { label: "Veg", icon: "🥦", color: "bg-green-100" },
                  { label: "Fruits", icon: "🍎", color: "bg-red-100" },
                  { label: "Dairy", icon: "🥛", color: "bg-blue-100" },
                  { label: "Munchies", icon: "🥨", color: "bg-orange-100" },
                  { label: "Meat", icon: "🍗", color: "bg-red-200" },
                  { label: "Bakery", icon: "🥐", color: "bg-yellow-200" },
                  { label: "Personal", icon: "🧴", color: "bg-teal-100" },
                  { label: "Pet Care", icon: "🐶", color: "bg-indigo-100" }
                ].map((cat, i) => (
                  <motion.div 
                    key={cat.label} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className={`w-14 h-14 ${cat.color} rounded-[24px] flex items-center justify-center text-3xl shadow-md border-2 border-white group-hover:scale-110 transition-transform active:scale-95`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-[1000] text-slate-600 tracking-tight uppercase">{cat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Success Overlay */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#1B5E20] p-6 rounded-[40px] shadow-2xl shadow-green-900/40 text-center space-y-3 border-4 border-[#2E7D32] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                <div className="relative">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#1B5E20] mx-auto shadow-2xl border-4 border-green-500/20 mb-3">
                      <Check size={36} strokeWidth={4} />
                   </div>
                   <h4 className="text-xl font-[1000] text-white tracking-tighter italic">{t("scannedSuccess")}</h4>
                   <p className="text-xs font-black text-white/70 uppercase tracking-widest">{t("iaSuccessMsg")}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Bottom Nav */}
            <div className="p-6 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
               <div className="flex flex-col items-center gap-1.5 text-green-700 font-black"><LayoutGrid size={24} /> <span className="text-[9px] uppercase tracking-tighter">Products</span></div>
               <div className="flex flex-col items-center gap-1.5 text-slate-300 font-black opacity-50"><Search size={24} /> <span className="text-[9px] uppercase tracking-tighter">Search</span></div>
               <div className="flex flex-col items-center gap-1.5 text-slate-300 font-black opacity-50"><ShoppingBag size={24} /> <span className="text-[9px] uppercase tracking-tighter">Cart</span></div>
               <div className="flex flex-col items-center gap-1.5 text-slate-300 font-black opacity-50"><Clock size={24} /> <span className="text-[9px] uppercase tracking-tighter">Orders</span></div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <StepModule
      title={t("installAppTitle")}
      backPath="/practice"
      speakKey="iaSpeak"
      onComplete={() => markCompleted("installAppCompleted")}
      successTitleKey="iaSuccessTitle"
      successMsgKey="iaSuccessMsg"
      learningKeys={["iaLearn1", "iaLearn2", "iaLearn3"]}
      steps={[
        {
          titleKey: stage === "HOME" ? "tapPlayStoreIcon" : stage === "PS_HOME" || stage === "PS_SEARCH" ? "typeBlinkitInSearch" : stage === "BLINKIT_SPLASH" ? "completed" : "installWhatsApp",
          canProceed: stage === "BLINKIT_SPLASH",
          content: (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-[360px]">
                {renderStageContent()}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
