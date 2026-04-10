import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Mic, Home, MapPin,
  ChevronRight, CheckCircle, Navigation,
  Delete, ArrowUp, Smile, LayoutGrid, Printer, Clock, Star, LocateFixed, X, RotateCcw, Box, HelpCircle, ShoppingBag, ArrowLeft, CreditCard, Banknote, Smartphone
} from "lucide-react";

export type OBStage =
  | "OB_HOME"
  | "OB_SEARCH_FIRST"
  | "OB_PRODUCT_FIRST"
  | "OB_SEARCH_SECOND"
  | "OB_PRODUCT_SECOND"
  | "OB_CART"
  | "OB_CHECKOUT"
  | "OB_SUCCESS";

export function OrderBlinkit() {
  const { t, speak, markCompleted } = useApp();
  const [stage, setStage] = useState<OBStage>("OB_HOME");

  // Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [showMicOverlay, setShowMicOverlay] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState(1);
  const [mangoAdded, setMangoAdded] = useState(false);
  const [mangoQuantity, setMangoQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<"home" | "office" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"phonepe" | "gpay" | "otherupi" | "card" | "cash" | null>(null);

  useEffect(() => {
    if (stage === "OB_CART" && !milkAdded && !mangoAdded) {
      setStage("OB_PRODUCT_SECOND"); // Automatically close cart if empty
    }
  }, [stage, milkAdded, mangoAdded]);

  useEffect(() => {
    if (stage === "OB_SUCCESS") markCompleted("orderBlinkitCompleted");
  }, [stage, markCompleted]);

  const handleSearchChangeFirst = (query: string) => {
    setSearchQuery(query);
  };
  const handleSearchChangeSecond = (query: string) => {
    setSearchQuery(query);
  };

  const submitSearch = () => {
    if (stage === "OB_SEARCH_FIRST") setStage("OB_PRODUCT_FIRST");
    if (stage === "OB_SEARCH_SECOND") setStage("OB_PRODUCT_SECOND");
  };

  const handleMicClick = () => {
    setShowMicOverlay(true);
    setTimeout(() => {
      setShowMicOverlay(false);
      if (stage === "OB_SEARCH_FIRST") {
        setSearchQuery("Milk");
        setStage("OB_PRODUCT_FIRST");
      } else {
        setSearchQuery("Mango");
        setStage("OB_PRODUCT_SECOND");
      }
    }, 2000);
  };

  const getStepProgress = () => {
    switch (stage) {
      case "OB_HOME":
      case "OB_SEARCH_FIRST":
      case "OB_PRODUCT_FIRST":
      case "OB_SEARCH_SECOND":
      case "OB_PRODUCT_SECOND": return 33;
      case "OB_CART": return 66;
      case "OB_CHECKOUT": return 85;
      case "OB_SUCCESS": return 100;
      default: return 0;
    }
  };

  const renderSimContent = () => {
    // -------------------------------------------------------------
    // IMAGE 1: HOME SCREEN (YELLOW HEADER, CATEGORIES, PRODUCT GRID)
    // -------------------------------------------------------------
    if (stage === "OB_HOME") {
      return (
        <div className="relative w-full h-[650px] bg-[#F4F6F9] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col font-sans tracking-tight">

          <div className="bg-[#F8CB46] px-4 pt-10 pb-0">
            {/* Header Address Pill */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[12px] font-black text-black/80 flex items-center gap-2 mb-1">
                  Blinkit in
                </div>
                <div className="text-[15px] font-bold text-black flex items-center gap-1 cursor-pointer hover:opacity-80">
                  Karvenagar, Pune Division, Pune <span className="text-[10px]">▼</span>
                </div>
              </div>
              <div className="bg-[#4D657D]/10 backdrop-blur-sm text-[#18536A] px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-bold shadow-sm">
                <Home size={10} /> 1.1 km away
              </div>
            </div>

            {/* Search Bar matching Image 1 */}
            <div
              onClick={() => setStage("OB_SEARCH_FIRST")}
              className="bg-white rounded-[14px] px-3 py-3.5 flex items-center gap-3 shadow-md mb-4 cursor-pointer relative animate-pulse ring-2 ring-blue-500 ring-offset-[#F8CB46] ring-offset-2"
            >
              <Search size={22} className="text-black stroke-[3px]" />
              <div className="flex-1 text-[15px] text-slate-800 flex font-medium">
                Search "healthy snacks"
              </div>
              <div className="w-[1px] h-5 bg-slate-300" />
              <Mic size={20} className="text-black" />
            </div>

            {/* Categories Top Nav */}
            <div className="flex items-end justify-between px-1 pb-1">
              <div className="flex flex-col items-center gap-1 cursor-pointer border-b-2 border-black pb-1.5 px-2">
                <Box size={22} className="text-black" />
                <span className="text-[11px] font-bold text-black">All</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-black/70 pb-2 px-2">
                <Smile size={22} />
                <span className="text-[11px] font-medium">Summer</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-black/70 pb-2 px-2">
                <Home size={22} />
                <span className="text-[11px] font-medium">Electronics</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-black/70 pb-2 px-2">
                <Star size={22} />
                <span className="text-[11px] font-medium">Beauty</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-black/70 pb-2 px-2">
                <HelpCircle size={22} />
                <span className="text-[11px] font-medium">Pharmacy</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white pt-5 px-4 pb-24">
            <h2 className="text-lg font-[900] text-slate-900 tracking-tight mb-4">Frequently bought</h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Milk, Curd & Paneer", label: "+3 more" },
                { name: "Cakes & Biscuits" },
                { name: "Chips & Namkeen", label: "+2 more" },
                { name: "Oil, Ghee & Masala", label: "+1 more" },
                { name: "Home Essentials" }
              ].map((cat, i) => (
                <div
                  key={i}
                  onClick={() => setStage("OB_PRODUCT_FIRST")}
                  className="bg-[#EBF7F4] rounded-[16px] aspect-[4/5] p-2 flex flex-col items-center relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex justify-center gap-1 mt-1 mb-2">
                    <div className="w-9 h-10 bg-white rounded shadow-sm"></div>
                    <div className="w-9 h-10 bg-white rounded shadow-sm"></div>
                  </div>
                  {cat.label && <div className="bg-white/80 backdrop-blur-sm text-[#3E8062] text-[9px] font-bold px-2 py-0.5 rounded-full absolute top-[60px] shadow-sm">{cat.label}</div>}
                  <div className="text-center font-bold text-slate-800 text-[11px] leading-tight mt-auto w-full pt-2">
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-6 py-2 pb-5 flex justify-between rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-[#FFE066] p-1.5 rounded-full"><Home size={20} className="text-black" /></div>
              <span className="text-[10px] font-bold text-black">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-1.5 text-slate-500">
              <RotateCcw size={20} />
              <span className="text-[10px] font-medium">Order Again</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-1.5 text-slate-500">
              <LayoutGrid size={20} />
              <span className="text-[10px] font-medium">Categories</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-1.5 text-slate-500">
              <Printer size={20} />
              <span className="text-[10px] font-medium">Print</span>
            </div>
          </div>

        </div>
      );
    }

    // SEARCH SCREENS
    if (stage === "OB_SEARCH_FIRST" || stage === "OB_SEARCH_SECOND") {
      const isSecond = stage === "OB_SEARCH_SECOND";
      const handler = isSecond ? handleSearchChangeSecond : handleSearchChangeFirst;
      const targetWord = isSecond ? "Mango" : "Milk";

      return (
        <div className="relative w-full h-[650px] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col font-sans">

          {/* Header Search Replica */}
          <div className="bg-[#F8CB46] px-3 pt-10 pb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/5 flex flex-col items-center justify-center cursor-pointer active:bg-black/10 transition-colors" onClick={() => setStage(isSecond ? "OB_PRODUCT_FIRST" : "OB_HOME")}>
              <ArrowLeft size={20} className="text-black" />
            </div>
            <div className="flex-1 bg-white rounded-[14px] px-3 py-2 flex items-center gap-2 shadow-sm relative">
              <Search size={18} className="text-slate-500 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                className="bg-transparent border-none outline-none text-slate-800 font-medium text-sm w-full placeholder:text-slate-400"
                placeholder="Search"
                readOnly
              />
              {searchQuery && <X size={16} className="text-slate-400 shrink-0 bg-slate-100 rounded-full cursor-pointer" onClick={() => handler("")} />}
              <div className="w-[1px] h-5 bg-slate-300 mx-1" />
              <Mic size={18} className="text-slate-600 shrink-0 active:text-blue-500 cursor-pointer" onClick={handleMicClick} />
            </div>
          </div>

          <div className="bg-blue-50/80 px-4 py-2 border-b border-blue-100 flex items-center justify-center gap-2">
            <span className="text-xs font-bold tracking-wide text-blue-700">Type "{targetWord}" using the keyboard below</span>
          </div>

          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {searchQuery.length > 0 && searchQuery.toLowerCase().includes(targetWord.charAt(0).toLowerCase()) && (
              <motion.div
                whileTap={{ backgroundColor: "#F8FAFC" }}
                className="flex items-center gap-4 py-3 px-4 rounded-xl cursor-pointer bg-white border border-slate-200 shadow-sm animate-pulse ring-2 ring-blue-400 ring-offset-2 mx-2 mt-2"
                onClick={submitSearch}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Search size={18} className="text-slate-400" />
                </div>
                <span className="text-[15px] font-bold text-slate-800 flex-1">{targetWord}</span>
                <Navigation size={16} className="text-slate-300 shrink-0 rotate-45" />
              </motion.div>
            )}
          </div>

          {/* iOS Exact Replica Keyboard */}
          {/* Using identical layout from InstallApp.tsx for realism */}
          <div className="mt-auto bg-[#D1D3D9] pb-3 pt-1.5 flex flex-col gap-1.5 shrink-0 select-none">
            <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
              {"QWERTYUIOP".split("").map(l => (
                <button key={l} onClick={() => handler(searchQuery + l)} className="flex-1 h-8 bg-[#FCFCFE] rounded-[4px] text-[15px] font-normal text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 min-w-0 flex items-center justify-center">{l}</button>
              ))}
            </div>
            <div className="flex justify-center w-[98%] mx-auto gap-[2px]">
              <div className="w-[4.5%]" />
              {"ASDFGHJKL".split("").map(l => (
                <button key={l} onClick={() => handler(searchQuery + l)} className="flex-[10] h-8 bg-[#FCFCFE] rounded-[4px] text-[15px] font-normal text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 min-w-0 flex items-center justify-center">{l}</button>
              ))}
              <div className="w-[4.5%]" />
            </div>
            <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
              <button className="flex-[12.5] h-8 bg-[#B3B7BD] rounded-[4px] flex items-center justify-center text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)]"><ArrowUp size={16} strokeWidth={3} /></button>
              {"ZXCVBNM".split("").map(l => (
                <button key={l} onClick={() => handler(searchQuery + l)} className="flex-[10] h-8 bg-[#FCFCFE] rounded-[4px] text-[15px] font-normal text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD] transition-colors pb-0.5 min-w-0 flex items-center justify-center">{l}</button>
              ))}
              <button onClick={() => handler(searchQuery.slice(0, -1))} className="flex-[12.5] h-8 bg-[#B3B7BD] rounded-[4px] flex items-center justify-center text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#FCFCFE]"><Delete size={16} fill="currentColor" className="text-slate-800" /></button>
            </div>
            <div className="flex justify-between w-[98%] mx-auto gap-[2px]">
              <button className="flex-[22] h-8 bg-[#B3B7BD] rounded-[4px] text-[13px] font-normal tracking-wide text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)]">123</button>
              <button onClick={() => handler(searchQuery + " ")} className="flex-[56] h-8 bg-[#FCFCFE] rounded-[4px] text-[13px] font-normal text-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-[#B3B7BD]">space</button>
              <button onClick={submitSearch} className="flex-[22] h-8 bg-[#B3B7BD] rounded-[4px] text-slate-600 text-[13px] font-normal tracking-wide shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-blue-600 active:text-white transition-colors">return</button>
            </div>
            <div className="flex items-center justify-between px-3 pt-1 text-[#464A53]">
              <Smile size={20} strokeWidth={1.5} />
              <Mic size={20} strokeWidth={1.5} onClick={handleMicClick} />
            </div>
            <div className="w-[30%] h-[4px] mt-1 rounded-full bg-slate-900 mx-auto" />
          </div>

          <AnimatePresence>
            {showMicOverlay && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Mic size={40} className="text-red-500" />
                </div>
                <p className="text-lg font-bold text-slate-800">Listening for "{targetWord}"...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // -------------------------------------------------------------
    // IMAGE 2: SPLIT SCREEN PRODUCT LISTING
    // -------------------------------------------------------------
    if (stage === "OB_PRODUCT_FIRST" || stage === "OB_PRODUCT_SECOND") {
      const isSecond = stage === "OB_PRODUCT_SECOND";
      const isAdded = isSecond ? mangoAdded : milkAdded;
      const quantity = isSecond ? mangoQuantity : milkQuantity;
      const setAdded = isSecond ? setMangoAdded : setMilkAdded;
      const setQuantity = isSecond ? setMangoQuantity : setMilkQuantity;

      return (
        <div className="relative w-full h-[650px] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col font-sans tracking-tight">

          {/* Header - Image 2 shows a generic transparent black app overlay with an 'X' button above a modal, but let's make it a clean header for simplicity */}
          <div className="bg-white flex items-center justify-between px-4 pt-10 pb-4 border-b border-slate-100 shadow-sm z-10">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center cursor-pointer active:bg-black/10" onClick={() => setStage("OB_HOME")}>
              <X size={18} className="text-black" />
            </div>
            <div onClick={() => { setSearchQuery(""); setStage("OB_SEARCH_SECOND"); }} className="w-10 h-10 -mr-2 flex items-center justify-center cursor-pointer">
              <Search size={22} className="text-slate-600" />
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar (Categories) */}
            <div className="w-[85px] bg-[#F4F6F9] shrink-0 overflow-y-auto border-r border-slate-100 flex flex-col items-center py-4 gap-6 relative">
              {/* Active Indicator green line */}
              <div className="absolute left-0 top-[20px] w-1 h-16 bg-[#1C8D20] rounded-r-lg" />
              <div className="flex flex-col items-center gap-1.5 w-full cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#EBF2EA] flex items-center justify-center border border-[#1C8D20]/20">
                  <ShoppingBag size={20} className="text-[#1C8D20]" />
                </div>
                <span className="text-[10px] font-bold text-center text-slate-800 leading-tight">Previously<br />Bought</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-full cursor-pointer opacity-50">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
                  <Box size={16} className="text-blue-500" />
                </div>
                <span className="text-[10px] font-medium text-center text-slate-600 leading-tight">Milk</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-full cursor-pointer opacity-50">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
                  <Smile size={16} className="text-blue-500" />
                </div>
                <span className="text-[10px] font-medium text-center text-slate-600 leading-tight">Curd &<br />Yogurt</span>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 bg-white overflow-y-auto pt-4 px-4 pb-24 relative">
              <h2 className="text-[15px] font-[900] text-slate-900 mb-4">{isSecond ? "Fresh Fruits" : "Milk, Curd & Paneer"}</h2>

              <div className="w-full flex justify-between gap-4">
                {/* The Interactive Product Card */}
                <div className="w-full relative flex flex-col items-center pb-2">
                  <div className="w-full aspect-square bg-[#F8FAFC] border border-slate-100 rounded-[16px] mb-8 flex items-center justify-center shadow-sm relative overflow-visible">
                    {isSecond ? (
                      <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-200 shadow-sm" />
                    ) : (
                      <div className="w-16 h-20 bg-white shadow flex items-center justify-center border border-blue-100 rounded-sm">
                        <div className="bg-blue-600 text-white font-black text-[8px] p-1">AMUL</div>
                      </div>
                    )}

                    {/* THE 'ADD' BUTTON - Positioned absolutely overlapping the image bottom matching Image 2 */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-md rounded-[8px] overflow-hidden bg-white z-20">
                      {!isAdded ? (
                        <button
                          onClick={() => setAdded(true)}
                          className="w-[84px] h-[34px] flex items-center justify-center text-[#1C8D20] border border-[#1C8D20] font-bold text-[13px] tracking-wide active:bg-green-50 rounded-[8px] bg-white transition-opacity"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="w-[84px] h-[34px] bg-[#1C8D20] rounded-[8px] flex items-center justify-between text-white font-bold text-[15px] shadow-sm">
                          <button
                            onClick={() => {
                              if (quantity <= 1) {
                                setAdded(false);
                                setQuantity(1);
                              } else {
                                setQuantity(quantity - 1);
                              }
                            }}
                            className="w-1/3 h-full flex items-center justify-center active:bg-black/20"
                          >
                            −
                          </button>
                          <span className="w-1/3 text-center text-[13px] flex items-center justify-center">{quantity}</span>
                          <button
                            onClick={() => {
                              setQuantity(quantity + 1);
                            }}
                            className={`w-1/3 h-full flex items-center justify-center active:bg-black/20 ${quantity === 1 ? 'animate-pulse' : ''}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full text-left mt-2">
                    {/* Veg Symbol */}
                    <div className="flex border-[1.5px] border-[#228B22] w-3 h-3 rounded-[3px] items-center justify-center p-[2px] mb-1">
                      <div className="bg-[#228B22] rounded-full w-full h-full" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-[13px] leading-[1.2] mb-1 min-h-[32px]">
                      {isSecond ? "Alphonso Mango (Ratnagiri)" : "Amul Taaza Toned Milk"}
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium mb-1">
                      {isSecond ? "1 kg" : "1 L"}
                    </p>

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="flex text-yellow-400">
                        <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">(2.96 lac)</span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] w-max px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 mb-2">
                      <Clock size={10} className="text-[#1C8D20] stroke-[3px]" /> 8 MINS
                    </div>

                    <p className="text-[14px] font-black text-slate-900 mt-2">
                      ₹{isSecond ? "240" : "68"}
                    </p>
                  </div>
                </div>

                {/* Dummy Card for generic grid fill */}
                <div className="w-full relative flex flex-col items-center opacity-40 pointer-events-none">
                  <div className="w-full aspect-square bg-[#F8FAFC] border border-slate-100 rounded-[16px] mb-8 flex items-center justify-center shadow-sm relative">
                    <div className="w-16 h-20 bg-white border border-slate-200"></div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[84px] h-[34px] bg-white border border-slate-300 rounded-[8px] flex items-center justify-center text-[#1C8D20] font-bold text-[13px]">ADD</div>
                  </div>
                  <div className="w-full text-left mt-2">
                    <div className="flex border-[1.5px] border-[#228B22] w-3 h-3 rounded-[3px] items-center justify-center p-[2px] mb-1"><div className="bg-[#228B22] rounded-full w-full h-full" /></div>
                    <h3 className="font-bold text-slate-800 text-[13px] leading-[1.2] mb-1 min-h-[32px]">Mother Dairy Milk</h3>
                    <p className="text-[12px] text-slate-500 font-medium mb-1">500 ml</p>
                    <p className="text-[14px] font-black text-slate-900 mt-8">₹34</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING VIEW CART (Mimics Image 1/2 pill) */}
          {(milkAdded || mangoAdded) && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-[#1C8D20] text-white p-2 pr-4 rounded-full shadow-[0_5px_20px_rgba(28,141,32,0.4)] flex items-center justify-between active:bg-[#156e18] cursor-pointer z-50 transition-colors border border-[#2DB833]/50 animate-bounce"
              onClick={() => {
                setStage("OB_CART");
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden shrink-0 border-2 border-[#1C8D20]">
                  <ShoppingBag size={20} className="text-[#1C8D20]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-black leading-tight tracking-tight">View cart</span>
                  <span className="text-[11px] font-bold text-white/90">{milkQuantity + (mangoAdded ? mangoQuantity : 0)} {milkQuantity + (mangoAdded ? mangoQuantity : 0) === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <ChevronRight size={16} strokeWidth={3} className="ml-0.5" />
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    // OB_CART REMAINING SIMILAR BUT ADJUSTED FOR HEIGHT. We skip direct checkout for user realism.
    if (stage === "OB_CART") {
      const milkTotal = milkAdded ? (milkQuantity * 68) : 0;
      const mangoTotal = mangoAdded ? (mangoQuantity * 240) : 0;
      const subtotal = milkTotal + mangoTotal;
      const delivery = 15;

      return (
        <div className="relative w-full h-[650px] bg-[#F4F6F9] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col font-sans">
          <div className="bg-white px-4 pt-10 pb-4 flex items-center gap-3 shadow-sm z-10 relative">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center cursor-pointer" onClick={() => setStage("OB_PRODUCT_SECOND")}>
              <ArrowLeft size={18} />
            </div>
            <h2 className="font-bold text-lg text-slate-800 tracking-tight">Checkout</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
            <div className="bg-white rounded-[16px] p-4 shadow-sm">
              <h3 className="font-bold text-[13px] text-slate-500 mb-4 uppercase tracking-wider">Items</h3>

              {milkAdded && (
                <div className={`flex items-start justify-between pb-4 ${mangoAdded ? 'mb-4 border-b border-slate-100' : ''}`}>
                  <div>
                    <div className="font-bold text-slate-800 text-[14px]">Amul Taaza Toned Milk</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">1 L</div>
                    <div className="font-bold text-slate-800 mt-2 text-[14px]">₹68</div>
                  </div>
                  <div className="w-[84px] h-[34px] bg-[#1C8D20] rounded-[8px] flex items-center justify-between text-white font-bold text-[15px] shadow-sm">
                    <button
                      onClick={() => {
                        if (milkQuantity <= 1) {
                          setMilkAdded(false);
                          setMilkQuantity(1);
                        } else {
                          setMilkQuantity(milkQuantity - 1);
                        }
                      }}
                      className="w-1/3 h-full flex items-center justify-center active:bg-black/20"
                    >
                      −
                    </button>
                    <span className="w-1/3 text-center text-[13px] flex items-center justify-center">{milkQuantity}</span>
                    <button
                      onClick={() => setMilkQuantity(milkQuantity + 1)}
                      className="w-1/3 h-full flex items-center justify-center active:bg-black/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {mangoAdded && (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-[14px]">Alphonso Mango (Ratnagiri)</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">1 kg</div>
                    <div className="font-bold text-slate-800 mt-2 text-[14px]">₹240</div>
                  </div>
                  <div className="w-[84px] h-[34px] bg-[#1C8D20] rounded-[8px] flex items-center justify-between text-white font-bold text-[15px] shadow-sm">
                    <button
                      onClick={() => {
                        if (mangoQuantity <= 1) {
                          setMangoAdded(false);
                          setMangoQuantity(1);
                        } else {
                          setMangoQuantity(mangoQuantity - 1);
                        }
                      }}
                      className="w-1/3 h-full flex items-center justify-center active:bg-black/20"
                    >
                      −
                    </button>
                    <span className="w-1/3 text-center text-[13px] flex items-center justify-center">{mangoQuantity}</span>
                    <button
                      onClick={() => setMangoQuantity(mangoQuantity + 1)}
                      className="w-1/3 h-full flex items-center justify-center active:bg-black/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[16px] p-4 shadow-sm">
              <h3 className="font-bold text-[13px] text-slate-500 mb-3 uppercase tracking-wider">Bill Details</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between text-slate-600"><span>Item Total</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-slate-600"><span>Delivery Charge</span><span>₹{delivery}</span></div>
                <div className="flex justify-between font-bold text-slate-800 pt-3 border-t border-slate-100 border-dashed text-[15px]">
                  <span>Grand Total</span><span>₹{subtotal + delivery}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods Moved to Cart */}
            <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shadow-sm mb-4">
              <h3 className="font-bold text-[13px] text-slate-500 mb-1 mt-4 px-4 uppercase tracking-wider">Payment Method</h3>
              <div onClick={() => setSelectedPayment("phonepe")} className={`p-4 flex items-center justify-between border-b border-slate-100 cursor-pointer ${selectedPayment === "phonepe" ? "bg-[#EBF7F4]" : ""}`}>
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className={selectedPayment === "phonepe" ? "text-[#1C8D20]" : "text-slate-500"} />
                  <span className="font-bold text-slate-800 text-[14px]">PhonePe UPI</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === "phonepe" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                  {selectedPayment === "phonepe" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                </div>
              </div>
              <div onClick={() => setSelectedPayment("gpay")} className={`p-4 flex items-center justify-between border-b border-slate-100 cursor-pointer ${selectedPayment === "gpay" ? "bg-[#EBF7F4]" : ""}`}>
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className={selectedPayment === "gpay" ? "text-[#1C8D20]" : "text-slate-500"} />
                  <span className="font-bold text-slate-800 text-[14px]">Google Pay</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === "gpay" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                  {selectedPayment === "gpay" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                </div>
              </div>
              <div onClick={() => setSelectedPayment("card")} className={`p-4 flex items-center justify-between border-b border-slate-100 cursor-pointer ${selectedPayment === "card" ? "bg-[#EBF7F4]" : ""}`}>
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className={selectedPayment === "card" ? "text-[#1C8D20]" : "text-slate-500"} />
                  <span className="font-bold text-slate-800 text-[14px]">Credit / Debit Card</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === "card" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                  {selectedPayment === "card" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4 pb-8 flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50">
            <div>
              <p className="text-[12px] text-slate-500 font-medium">To pay</p>
              <p className="text-xl font-black tracking-tight text-slate-900">₹{subtotal + delivery}</p>
            </div>
            <button
              onClick={() => { if (selectedPayment) setStage("OB_CHECKOUT"); }}
              className={`text-white font-bold px-8 py-3.5 rounded-[12px] text-center active:scale-95 transition-all shadow-md tracking-wide ${selectedPayment ? 'bg-[#1C8D20] ring-2 ring-[#1C8D20] ring-offset-2 animate-pulse' : 'bg-slate-300'}`}
            >
              Proceed to pay
            </button>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // IMAGE 3: LOCATION / CHECKOUT MODAL REPLICA
    // -------------------------------------------------------------
    if (stage === "OB_CHECKOUT") {
      const gtotal = (milkQuantity * 68) + (mangoQuantity * 240) + 15;

      return (
        <div className="relative w-full h-[650px] bg-black/60 rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col justify-end font-sans">

          {/* Top Floating X Button matching Image 3 */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center cursor-pointer mb-2 shadow-lg z-50 border border-white/10" onClick={() => setStage("OB_CART")}>
            <X size={20} className="text-white" strokeWidth={3} />
          </div>

          {/* White Bottom Sheet */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full h-[68%] rounded-t-[20px] flex flex-col relative"
          >
            <div className="px-4 py-5 pb-3">
              <h2 className="text-[17px] font-black text-slate-800 tracking-tight mb-4">Select delivery location</h2>

              {/* Search Location Bar */}
              <div className="bg-white border text-[14px] border-slate-200 rounded-[12px] px-3 py-3 flex items-center gap-2 shadow-sm mb-4 text-slate-400 font-medium">
                <Search size={20} className="text-slate-600" />
                Search for area...
              </div>

              {/* GPS Use Current Location */}
              <div
                onClick={() => { setSelectedAddress("home"); }}
                className={`flex items-center gap-3 py-3 border-b border-slate-100 cursor-pointer transition-colors ${selectedAddress === "home" ? "bg-blue-50/50" : "active:bg-slate-50"}`}
              >
                <LocateFixed size={20} className="text-[#1C8D20] shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-[#1C8D20]">Use your current location</h3>
                  <p className="text-[12px] text-slate-400 mt-0.5 leading-tight">MKSSS Cummins College Of Engineering For Women</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === "home" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                  {selectedAddress === "home" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                </div>
              </div>

              {/* Add New Address */}
              <div
                onClick={() => { setSelectedAddress("office"); }}
                className={`flex items-center gap-3 py-4 border-b border-slate-100 cursor-pointer ${selectedAddress === "office" ? "bg-blue-50/50" : "active:bg-slate-50"}`}
              >
                <div className="w-5" />
                <h3 className="flex-1 text-[14px] font-bold text-[#1C8D20]">Add new address</h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === "office" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                  {selectedAddress === "office" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                </div>
              </div>
            </div>

            {/* Saved Addresses Section */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 bg-slate-50/50 pt-2">
              <h3 className="text-[12px] font-medium text-slate-500 mb-3">Your saved addresses</h3>
              {/* Address Card matching Image 3 precisely */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 mt-4 px-1">
                <div
                  onClick={() => { setSelectedAddress("home"); }}
                  className={`bg-white rounded-[16px] p-4 flex gap-3 shadow-sm border cursor-pointer transition-all min-w-[280px] shrink-0 ${selectedAddress === "home" ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50/30" : "border-slate-200"}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-black text-slate-800">Home</h4>
                        <span className="text-[10px] font-bold text-[#297C96] bg-[#E5F5FA] px-1.5 py-0.5 rounded">7.41 km away</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === "home" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                        {selectedAddress === "home" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                      </div>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-snug pr-4 mb-2 line-clamp-2">
                      Floor 4, 402,B wing Prabha height near, green hill society, gujarwadi, Katraj, Pune
                    </p>
                    <p className="text-[12px] text-slate-600 font-medium">
                      Phone: <span className="font-bold text-slate-800">9307800595</span>
                    </p>
                  </div>
                </div>

                {/* Second Address Card */}
                <div
                  onClick={() => { setSelectedAddress("office"); }}
                  className={`bg-white rounded-[16px] p-4 flex gap-3 shadow-sm border cursor-pointer transition-all min-w-[280px] shrink-0 ${selectedAddress === "office" ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50/30" : "border-slate-200"}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-black text-slate-800">Office</h4>
                        <span className="text-[10px] font-bold text-[#297C96] bg-[#E5F5FA] px-1.5 py-0.5 rounded">11.2 km away</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === "office" ? "border-[#1C8D20]" : "border-slate-300"}`}>
                        {selectedAddress === "office" && <div className="w-2.5 h-2.5 bg-[#1C8D20] rounded-full" />}
                      </div>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-snug pr-4 mb-2 line-clamp-2">
                      Hinjawadi Rajiv Gandhi Infotech Park, Pune Phase 1
                    </p>
                    <p className="text-[12px] text-slate-600 font-medium">
                      Phone: <span className="font-bold text-slate-800">9307800595</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Place Order Button */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 flex shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50">
              <button
                onClick={() => { if (selectedAddress) setStage("OB_SUCCESS"); }}
                className={`w-full font-bold py-3.5 rounded-[12px] text-[15px] tracking-wide text-center transition-all ${selectedAddress ? "bg-[#1C8D20] text-white shadow-md active:scale-95 animate-pulse" : "bg-slate-300 text-white/70"}`}
              >
                Place Order ₹{gtotal}
              </button>
            </div>

          </motion.div>
        </div>
      );
    }

    // SUCCESS SCREEN
    if (stage === "OB_SUCCESS") {
      return (
        <div className="relative w-full h-[650px] bg-[#1C8D20] rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-[#1E293B] flex flex-col items-center justify-center text-center p-6 text-white tracking-tight">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl text-[#1C8D20]">
            <CheckCircle size={56} fill="currentColor" className="text-white" />
          </motion.div>

          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-[28px] font-black mb-3 leading-tight">
            Order placed<br />successfully!
          </motion.h2>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/90 font-medium text-[15px]">
            Arriving in 8 mins at Home.
          </motion.p>
        </div>
      );
    }
  };

  return (
    <StepModule
      title={t("orderBlinkitTitle")}
      backPath="/practice"
      speakKey="obSpeak"
      onComplete={() => markCompleted("orderBlinkitCompleted")}
      successTitleKey="obSuccessTitle"
      successMsgKey="obSuccessMsg"
      learningKeys={["obLearn1", "obLearn2", "obLearn3"]}
      steps={[
        {
          titleKey: stage === "OB_SUCCESS" ? "completed" : "obStepSearch",
          canProceed: stage === "OB_SUCCESS",
          content: (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-sm mb-6 flex flex-col gap-2 mx-auto">
                {/* Progress Bar */}
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden shadow-sm">
                  <div className="h-full bg-[#1C8D20] transition-all duration-500 ease-out" style={{ width: `${getStepProgress()}%` }} />
                </div>
              </div>

              <div className="w-full max-w-[360px] mx-auto flex items-center justify-center">
                {renderSimContent()}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
