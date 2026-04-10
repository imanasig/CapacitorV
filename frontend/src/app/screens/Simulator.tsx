import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Phone, PhoneOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type CallStep = "call-incoming-1" | "call-active-1" | "fail-1" | "success-1" | "call-incoming-2" | "call-active-2" | "fail-2" | "success-2" | "all-complete";

interface CallScenario {
  name: string;
  callerId: string;
  callerImage: string;
  callerIdColor: "blue" | "red";
  message: { en: string; hi: string };
  explanation: { en: string; hi: string };
}

export function Simulator() {
  const { t, language, markCompleted } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<CallStep>("call-incoming-1");
  const [currentCall, setCurrentCall] = useState<CallScenario | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const callScenarios: CallScenario[] = [
    {
      name: "Lottery Scam",
      callerId: "Unknown",
      callerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      callerIdColor: "red",
      message: { 
        en: "Congratulations! You've won a lottery prize worth 50 thousand rupees! We need your account details to transfer the money.", 
        hi: "बधाई हो! आपने 50,000 रुपये की लॉटरी जीती है! हमें पैसे ट्रांसफर करने के लिए आपके खाते का विवरण चाहिए।"
      },
      explanation: {
        en: "You never win lotteries you didn't enter. Always hang up on unknown callers asking for money.",
        hi: "आप कभी उस लॉटरी में नहीं जीतते जिसमें आपने भाग नहीं लिया।"
      }
    },
    {
      name: "Bank Call",
      callerId: "+91 98765 43210",
      callerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      callerIdColor: "blue",
      message: { 
        en: "Hello sir, this is your bank calling. We detected suspicious activity. Please share your account number and OTP so we can secure it.", 
        hi: "नमस्ते, यह आपके बैंक की ओर से कॉल है। हमने संदिग्ध गतिविधि देखी है। कृपया अपना खाता नंबर और OTP साझा करें।"
      },
      explanation: {
        en: "Banks NEVER ask for OTP or account details over phone. Always call your bank back directly at their official number.",
        hi: "बैंक कभी भी फोन पर OTP या खाता विवरण नहीं मांगते।"
      }
    }
  ];

  const playAudio = (text: string) => {
    // Use Web Speech API to speak the message
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.9;
      speechSynthesis.cancel(); // Cancel any existing speech
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    // When entering call-active state, play the caller's message
    if (step === "call-active-1" || step === "call-active-2") {
      const message = language === 'en' ? currentCall?.message.en : currentCall?.message.hi;
      setTimeout(() => {
        if (message) playAudio(message);
      }, 500);
    }
  }, [step, currentCall, language]);

  const handleStartCall1 = () => {
    setCurrentCall(callScenarios[0]);
    setStep("call-active-1");
  };

  const handleStartCall2 = () => {
    setCurrentCall(callScenarios[1]);
    setStep("call-active-2");
  };

  const handleRejectCall = (isCorrect: boolean, nextStep: CallStep) => {
    if (isCorrect) {
      markCompleted("chatCompleted");
      setStep(nextStep);
    } else {
      navigate("/safety");
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center gap-3 shadow-md shrink-0 border-b border-slate-700">
        <button onClick={() => navigate("/safety")} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Caller ID Training</h2>
          <p className="text-sm text-gray-400">Learn to identify spam calls</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          
          {/* Incoming Call 1 - RED SPAM */}
          {step === "call-incoming-1" && callScenarios[0] && (
            <motion.div key="incoming-1" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-8">
                {/* Pulsing Caller Avatar */}
                <motion.div 
                  animate={{scale: [1, 1.1, 1]}}
                  transition={{repeat: Infinity, duration: 1.5}}
                  className="w-32 h-32 rounded-full mx-auto overflow-hidden border-8 border-red-500 shadow-2xl"
                >
                  <img src={callScenarios[0].callerImage} alt="caller" className="w-full h-full object-cover" />
                </motion.div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">INCOMING CALL</p>
                  <p className="text-white text-3xl font-bold mb-3">{callScenarios[0].callerId}</p>
                  <motion.div 
                    animate={{scale: [1, 1.05, 1]}}
                    transition={{repeat: Infinity, duration: 1}}
                    className="inline-block bg-red-500/30 text-red-200 px-4 py-2 rounded-full font-bold text-lg"
                  >
                    🔴 UNKNOWN NUMBER
                  </motion.div>
                </div>

                <div className="text-center">
                  <motion.div
                    animate={{opacity: [0.5, 1, 0.5]}}
                    transition={{repeat: Infinity, duration: 1.5}}
                    className="text-yellow-300 mb-3"
                  >
                    📞 RINGING
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 justify-center pt-6">
                  <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={() => handleRejectCall(true, "success-1")}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
                    aria-label="Reject call"
                  >
                    <PhoneOff size={40} />
                  </motion.button>
                  <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={handleStartCall1}
                    className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
                    aria-label="Accept call"
                  >
                    <Phone size={40} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Call 1 - RED SPAM */}
          {step === "call-active-1" && currentCall && (
            <motion.div key="active-1" initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-sm">
              <div className="bg-gradient-to-b from-red-900 to-slate-700 rounded-3xl p-8 text-center space-y-6">
                {/* In Call Indicator */}
                <motion.div 
                  animate={{scale: [1, 1.1, 1]}}
                  transition={{repeat: Infinity, duration: 1.2}}
                  className="w-24 h-24 rounded-full mx-auto overflow-hidden border-8 border-red-400 shadow-xl"
                >
                  <img src={currentCall.callerImage} alt="caller" className="w-full h-full object-cover" />
                </motion.div>

                <div>
                  <motion.p 
                    animate={{opacity: [0.7, 1, 0.7]}}
                    transition={{repeat: Infinity, duration: 1}}
                    className="text-green-300 text-lg font-bold mb-2"
                  >
                    🔴 IN CALL
                  </motion.p>
                  <p className="text-white text-2xl font-bold">{currentCall.callerId}</p>
                </div>

                {/* Caller Speaking */}
                <div className="bg-red-500/20 border-2 border-red-500/40 rounded-2xl p-6">
                  <p className="text-gray-100 text-lg leading-relaxed">"{language === 'en' ? currentCall.message.en : currentCall.message.hi}"</p>
                </div>

                {/* Decision - THIS IS THE CRITICAL CHOICE */}
                <div className="space-y-3 pt-4">
                  <p className="text-white font-bold text-lg">What will you do?</p>
                  <button
                    onClick={() => {
                      stopAudio();
                      handleRejectCall(true, "success-1");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg transition-all"
                  >
                    ✓ HANG UP - Don't Share Details
                  </button>
                  <button
                    onClick={() => {
                      stopAudio();
                      setStep("fail-1");
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg transition-all"
                  >
                    ✗ SHARE MY DETAILS
                  </button>
                </div>

                {/* Quick Hang Up */}
                <motion.button
                  whileTap={{scale: 0.9}}
                  onClick={() => {
                    stopAudio();
                    handleRejectCall(true, "success-1");
                  }}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 mx-auto flex items-center justify-center text-white shadow-lg active:scale-75 transition-all"
                  aria-label="End call"
                >
                  <PhoneOff size={32} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Success 1 - Correctly Rejected Spam */}
          {step === "success-1" && (
            <motion.div key="success-1" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-6">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:"spring"}} className="w-24 h-24 bg-green-500/30 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 size={56} className="text-green-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-green-400">Perfect! ✓</h3>
                <p className="text-gray-200 text-lg">You correctly rejected a spam call! You protected your money and information.</p>
                <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-200 text-sm">{language === 'en' ? callScenarios[0].explanation.en : callScenarios[0].explanation.hi}</p>
                </div>
                <button
                  onClick={() => setStep("call-incoming-2")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg"
                >
                  Next Scenario →
                </button>
              </div>
            </motion.div>
          )}

          {/* Fail 1 - Wrongly Shared Details on Spam Call */}
          {step === "fail-1" && (
            <motion.div key="fail-1" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-6">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:"spring"}} className="w-24 h-24 bg-red-500/30 rounded-full mx-auto flex items-center justify-center">
                  <AlertCircle size={56} className="text-red-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-red-400">Money Lost! ✗</h3>
                <p className="text-gray-200 text-lg">You shared your bank details with a scammer! The fraudster now has access to transfer your money.</p>
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 space-y-2">
                  <p className="text-red-200 text-sm font-bold">⚠️ Key Learning:</p>
                  <p className="text-red-200 text-sm">✗ Unknown callers asking for money are ALWAYS scammers</p>
                  <p className="text-red-200 text-sm">✗ No legitimate entity asks for bank details through unexpected calls</p>
                  <p className="text-red-200 text-sm">✓ ALWAYS hang up on unknown callers, no matter what they say</p>
                </div>
                <button
                  onClick={() => setStep("call-incoming-1")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg"
                >
                  Try Again →
                </button>
              </div>
            </motion.div>
          )}

          {/* Incoming Call 2 - BLUE AUTHENTIC-LOOKING */}
          {step === "call-incoming-2" && callScenarios[1] && (
            <motion.div key="incoming-2" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-8">
                {/* Pulsing Caller Avatar */}
                <motion.div 
                  animate={{scale: [1, 1.1, 1]}}
                  transition={{repeat: Infinity, duration: 1.5}}
                  className="w-32 h-32 rounded-full mx-auto overflow-hidden border-8 border-blue-500 shadow-2xl"
                >
                  <img src={callScenarios[1].callerImage} alt="caller" className="w-full h-full object-cover" />
                </motion.div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">INCOMING CALL</p>
                  <p className="text-white text-3xl font-bold mb-3">{callScenarios[1].callerId}</p>
                  <motion.div 
                    animate={{scale: [1, 1.05, 1]}}
                    transition={{repeat: Infinity, duration: 1}}
                    className="inline-block bg-blue-500/30 text-blue-200 px-4 py-2 rounded-full font-bold text-lg"
                  >
                    🔵 VERIFIED NUMBER
                  </motion.div>
                </div>

                {/* WARNING - Even if looks authentic, be cautious */}
                <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-4">
                  <p className="text-yellow-200 font-bold">⚠️ WARNING: Even if the caller ID shows a verified number, criminals can fake it!</p>
                </div>

                <div className="text-center">
                  <motion.div
                    animate={{opacity: [0.5, 1, 0.5]}}
                    transition={{repeat: Infinity, duration: 1.5}}
                    className="text-yellow-300"
                  >
                    📞 RINGING
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 justify-center pt-6">
                  <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={() => handleRejectCall(true, "success-2")}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
                    aria-label="Reject call"
                  >
                    <PhoneOff size={40} />
                  </motion.button>
                  <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={handleStartCall2}
                    className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
                    aria-label="Accept call"
                  >
                    <Phone size={40} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Call 2 - BLUE AUTHENTIC-LOOKING */}
          {step === "call-active-2" && currentCall && (
            <motion.div key="active-2" initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-sm">
              <div className="bg-gradient-to-b from-blue-900 to-slate-700 rounded-3xl p-8 text-center space-y-6">
                {/* In Call Indicator */}
                <motion.div 
                  animate={{scale: [1, 1.1, 1]}}
                  transition={{repeat: Infinity, duration: 1.2}}
                  className="w-24 h-24 rounded-full mx-auto overflow-hidden border-8 border-blue-400 shadow-xl"
                >
                  <img src={currentCall.callerImage} alt="caller" className="w-full h-full object-cover" />
                </motion.div>

                <div>
                  <motion.p 
                    animate={{opacity: [0.7, 1, 0.7]}}
                    transition={{repeat: Infinity, duration: 1}}
                    className="text-green-300 text-lg font-bold mb-2"
                  >
                    🔴 IN CALL
                  </motion.p>
                  <p className="text-white text-2xl font-bold">{currentCall.callerId}</p>
                </div>

                {/* Caller Speaking - Asking for Personal Details */}
                <div className="bg-blue-500/20 border-2 border-blue-500/40 rounded-2xl p-6">
                  <p className="text-gray-100 text-lg leading-relaxed">"{language === 'en' ? currentCall.message.en : currentCall.message.hi}"</p>
                </div>

                {/* Decision - THIS IS THE CRITICAL CHOICE */}
                <div className="space-y-3 pt-4">
                  <p className="text-white font-bold text-lg">What will you do?</p>
                  <button
                    onClick={() => {
                      stopAudio();
                      handleRejectCall(true, "success-2");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg transition-all"
                  >
                    ✓ HANG UP & VERIFY INDEPENDENTLY
                  </button>
                  <button
                    onClick={() => {
                      stopAudio();
                      setStep("fail-2");
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg transition-all"
                  >
                    ✗ SHARE OTP/DETAILS
                  </button>
                </div>

                {/* Quick Hang Up */}
                <motion.button
                  whileTap={{scale: 0.9}}
                  onClick={() => {
                    stopAudio();
                    handleRejectCall(true, "success-2");
                  }}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 mx-auto flex items-center justify-center text-white shadow-lg active:scale-75 transition-all"
                  aria-label="End call"
                >
                  <PhoneOff size={32} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Success 2 - Correctly Verified Independently */}
          {step === "success-2" && (
            <motion.div key="success-2" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-6">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:"spring"}} className="w-24 h-24 bg-green-500/30 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 size={56} className="text-green-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-green-400">Excellent! ✓</h3>
                <p className="text-gray-200 text-lg">You correctly verified independently! Even if the caller ID looked real, you protected yourself.</p>
                <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-200 text-sm">{language === 'en' ? callScenarios[1].explanation.en : callScenarios[1].explanation.hi}</p>
                </div>
                <button
                  onClick={() => {
                    markCompleted("chatCompleted");
                    navigate("/safety");
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg"
                >
                  Complete Training ✓
                </button>
              </div>
            </motion.div>
          )}

          {/* Fail 2 - Wrongly Shared OTP */}
          {step === "fail-2" && (
            <motion.div key="fail-2" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full max-w-sm">
              <div className="bg-slate-700 rounded-3xl p-8 text-center space-y-6">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:"spring"}} className="w-24 h-24 bg-red-500/30 rounded-full mx-auto flex items-center justify-center">
                  <AlertCircle size={56} className="text-red-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-red-400">Account Compromised! ✗</h3>
                <p className="text-gray-200 text-lg">You shared your OTP and account details with a scammer pretending to be your bank. Your account is now at risk!</p>
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 space-y-2">
                  <p className="text-red-200 text-sm font-bold">⚠️ Key Learning:</p>
                  <p className="text-red-200 text-sm">✗ Banks NEVER ask for OTP or passwords over phone</p>
                  <p className="text-red-200 text-sm">✗ Even if caller ID looks authentic, ALWAYS verify by calling back</p>
                  <p className="text-red-200 text-sm">✓ Always hang up and call your bank directly at the number on your card</p>
                </div>
                <button
                  onClick={() => setStep("call-incoming-2")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] shadow-lg"
                >
                  Try Again →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
