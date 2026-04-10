import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import { 
  QrCode, IndianRupee, CheckCircle2, Camera, Smartphone, 
  Image as ImageIcon, X, Zap, Grid3X3, MoreVertical 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function QRPay() {
  const { t, markCompleted } = useApp();
  const [phonePlaced, setPhonePlaced] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const handlePositionPhone = () => {
    setPhonePlaced(true);
    // Automatically trigger scan after a short delay to simulate "positioning"
    setTimeout(() => {
      setScanned(true);
    }, 2500);
  };

  const handleGallerySelect = () => {
    setIsAnalyzing(true);
    // Simulate analyzing the image from gallery
    setTimeout(() => {
      setIsAnalyzing(false);
      setScanned(true);
      setShowGallery(false);
    }, 1500);
  };

  return (
    <StepModule
      title={t("qrPayTitle")}
      backPath="/practice"
      speakKey="qrSpeak"
      onComplete={() => markCompleted("qrPayCompleted")}
      successTitleKey="qrSuccessTitle"
      successMsgKey="qrSuccessMsg"
      learningKeys={["qrLearn1", "qrLearn2", "qrLearn3"]}
      steps={[
        {
          titleKey: "qrStepScan",
          canProceed: scanned,
          content: (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 flex flex-col items-center space-y-6 relative overflow-hidden">
              {/* Authentic Scanner Viewport */}
              <div className="w-full aspect-square max-w-[320px] bg-[#0F172A] rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden border-8 border-[#F8FAFC] shadow-2xl">
                
                {/* Header Icons Overlay */}
                <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between text-white z-30 opacity-70">
                  <X size={24} className="cursor-pointer" />
                  <div className="flex items-center gap-6">
                    <Zap size={22} />
                    <Grid3X3 size={22} />
                    <MoreVertical size={22} />
                  </div>
                </div>

                {/* Simulated Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ 
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }} 
                />
                
                {/* QR Asset Area */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <img 
                    src="/qr-sample.png" 
                    alt="QR Code" 
                    className={`w-full h-full object-contain transition-all duration-1000 ${phonePlaced || scanned || isAnalyzing ? 'opacity-100 scale-100' : 'opacity-0 scale-90 grayscale'}`}
                  />
                  {!phonePlaced && !isAnalyzing && !scanned && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode size={100} className="text-white/5" />
                    </div>
                  )}
                </div>
                
                {/* Colorized Corner Guides */}
                <div className="absolute inset-10 pointer-events-none">
                  {/* Top Left - Red */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] border-[#EA4335] rounded-tl-[24px]" />
                  {/* Top Right - Yellow */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] border-[#FBBC05] rounded-tr-[24px]" />
                  {/* Bottom Left - Blue */}
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] border-[#4285F4] rounded-bl-[24px]" />
                  {/* Bottom Right - Green */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] border-[#34A853] rounded-br-[24px]" />
                </div>

                <AnimatePresence>
                  {/* Scanning Animation */}
                  {(phonePlaced || isAnalyzing) && !scanned && (
                    <motion.div 
                      initial={{ top: "15%" }}
                      animate={{ top: "80%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-x-12 h-1.5 bg-[#4285F4] shadow-[0_0_20px_#4285F4] z-40 rounded-full"
                    />
                  )}
                  
                  {/* Success Overlay */}
                  {scanned && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#34A853]/40 backdrop-blur-[4px] flex flex-col items-center justify-center z-50"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-4 rounded-full shadow-2xl"
                      >
                        <CheckCircle2 size={64} className="text-[#34A853]" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Gallery Button (Authentic Capsule Style) */}
                {!scanned && !isAnalyzing && (
                  <div className="absolute bottom-8 z-40">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGallery(true)}
                      className="bg-white text-gray-800 px-6 py-2.5 rounded-full shadow-xl flex items-center gap-3 border border-gray-100"
                    >
                      <ImageIcon size={20} className="text-gray-600" />
                      <span className="font-bold text-sm tracking-tight">{t("qrUploadGallery")}</span>
                    </motion.button>
                  </div>
                )}
                
                {/* Place Phone Prompt Overlay */}
                {!phonePlaced && !isAnalyzing && !scanned && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 pointer-events-none flex items-center justify-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex flex-col items-center text-white text-center p-4"
                    >
                      <div className="relative mb-3">
                        <Smartphone size={72} className="opacity-80" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] bg-[#EA4335] rounded-full p-2 border-2 border-white shadow-lg"
                        >
                          <Camera size={22} className="text-white" />
                        </motion.div>
                      </div>
                      <p className="text-sm font-black leading-tight bg-black/40 px-4 py-1.5 rounded-full">{t("qrPlacePhone")}</p>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Action Area Below Scanner */}
              <div className="w-full space-y-4 pt-2">
                {!phonePlaced && !scanned && !isAnalyzing ? (
                  <>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePositionPhone} 
                      className="w-full py-4 bg-[#03506F] text-white font-black text-lg rounded-[24px] shadow-lg flex items-center justify-center gap-3"
                    >
                      <Smartphone size={24} /> {t("qrBtnPlace")}
                    </motion.button>
                    
                    <p className="text-[11px] text-gray-400 text-center font-bold px-8 leading-relaxed">
                      {t("qrGalleryTip")}
                    </p>
                  </>
                ) : !scanned ? (
                  <div className="w-full py-6 bg-slate-50 text-[#03506F] font-black text-lg rounded-[24px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#03506F]/20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <QrCode size={36} className="text-[#4285F4]" />
                    </motion.div>
                    <span className="animate-pulse tracking-wide text-sm opacity-70 uppercase">Analyzing QR Code...</span>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-[#E8F5E9] border-2 border-[#A5D6A7] rounded-[24px] p-6 flex items-center gap-5"
                  >
                    <div className="bg-[#34A853] p-3 rounded-2xl shadow-lg">
                      <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#1B5E20] text-lg">{t("scannedSuccess")}</p>
                      <p className="text-[#2E7D32] font-bold">{t("merchantFreshMart")}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Animated Gallery Picker */}
              <AnimatePresence>
                {showGallery && (
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="absolute inset-0 bg-white z-[60] flex flex-col"
                  >
                    <div className="p-5 border-b flex items-center justify-between bg-slate-50/50">
                      <div>
                        <h3 className="font-black text-[#0A043C] text-lg">{t("qrSelectFromGallery")}</h3>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Select QR Code Image</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowGallery(false)} 
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 border border-gray-200"
                      >
                        <X size={20} />
                      </motion.button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-5 flex-1 overflow-y-auto bg-white">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleGallerySelect}
                          className="aspect-square bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-center relative group overflow-hidden shadow-sm"
                        >
                          <img 
                            src="/qr-sample.png" 
                            alt="QR from Gallery" 
                            className="w-[80%] h-[80%] object-contain opacity-40 group-hover:opacity-100 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 right-4 bg-white/90 rounded-xl p-1.5 shadow-sm">
                            <ImageIcon size={16} className="text-[#4285F4]" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="p-8 bg-slate-50 border-t">
                      <div className="bg-white p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-2 rounded-xl">
                          <ImageIcon size={20} className="text-[#4285F4]" />
                        </div>
                        <p className="text-xs text-blue-900/60 font-bold leading-relaxed italic">
                          "{t("qrGalleryTip")}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ),
        },
        {
          titleKey: "qrStepAmount",
          canProceed: Number(amount) > 0,
          content: (
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 space-y-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-[#E1F5FE] p-5 rounded-[24px]">
                  <IndianRupee size={40} className="text-[#0288D1]" />
                </div>
                <div>
                  <h3 className="text-[#102A43] font-black text-2xl">{t("howMuchToPay")}</h3>
                  <p className="text-blue-500 font-black text-sm uppercase tracking-widest">{t("payToFreshMart")}</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#03506F] to-[#4285F4] opacity-5 rounded-[28px] blur-lg group-focus-within:opacity-10 transition-opacity" />
                <div className="relative flex items-center">
                  <span className="absolute left-6 text-4xl font-black text-[#03506F]/40 italic">₹</span>
                  <input 
                    type="tel" 
                    inputMode="numeric" 
                    value={amount}
                    autoFocus
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className="w-full h-24 pl-16 pr-8 bg-white text-[#0A043C] text-5xl font-black rounded-[28px] border-[4px] border-[#03506F]/10 focus:border-[#03506F] focus:outline-none transition-all text-center shadow-inner"
                    placeholder="0" 
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          titleKey: "qrStepPin",
          canProceed: pin.length >= 4,
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#03506F] to-[#0A043C] rounded-[32px] p-10 shadow-2xl text-center text-white relative overflow-hidden">
                <motion.div 
                  initial={{ opacity: 0.1, rotate: -15, scale: 0.8 }}
                  animate={{ opacity: 0.1, rotate: -15, scale: 1 }}
                  className="absolute -top-4 -right-4"
                >
                  <IndianRupee size={180} />
                </motion.div>
                <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mb-3">{t("securePayment") || "SECURE PAYMENT"}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-2xl font-bold text-white/50 italic mt-1">₹</span>
                  <p className="text-6xl font-[1000] tracking-tighter">{amount || "0"}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full inline-flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                   <p className="text-white/90 font-black text-sm">{t("toFreshMart")}</p>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 space-y-6">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">{t("enterUpiPin")}</p>
                  <div className="h-1 w-8 bg-gray-100 rounded-full" />
                </div>
                
                <input 
                  type="password" 
                  inputMode="numeric" 
                  value={pin}
                  autoFocus
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-20 px-8 bg-slate-50 text-[#0A043C] text-5xl text-center tracking-[0.6em] rounded-[24px] border-[4px] border-[#03506F]/5 focus:border-[#03506F] focus:outline-none transition-all shadow-inner font-black"
                  placeholder="••••" 
                />
                
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3"
                >
                  <div className="bg-red-500 p-1 rounded-lg mt-0.5">
                    <X size={12} className="text-white" />
                  </div>
                  <p className="text-[11px] text-red-900 font-black leading-tight uppercase tracking-tight">
                    {t("pinWillDeduct")}
                  </p>
                </motion.div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
