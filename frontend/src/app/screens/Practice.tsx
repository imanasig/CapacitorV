import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Volume2, ArrowLeft, Info, AlertTriangle, Check, Banknote, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type PracticeStep =
  | "pin-create"
  | "pin-confirm"
  | "pin-done"
  | "fake-request-view"
  | "pin-entry-scam"
  | "success-report"
  | "safe-send"
  | "pin-entry-safe"
  | "success-safe";

const TOTAL_STEPS = 5;

function getStepNumber(step: PracticeStep): number {
  switch (step) {
    case "pin-create": return 1;
    case "pin-confirm": return 2;
    case "pin-done": return 3;
    case "fake-request-view": return 4;
    case "safe-send": return 5;
    default: return 0; // overlay/result steps don't show indicator
  }
}

export function Practice() {
  const { t, language, speak, markCompleted } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<PracticeStep>("pin-create");
  const [pin, setPin] = useState("");
  const [setupPin, setSetupPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "warning" | "error" | ""; message: string }>({ type: "", message: "" });

  const handleSpeak = (text: string) => speak(text);

  // --- PIN Setup Logic ---
  const isWeakPin = (p: string) => {
    if (/^(\d)\1+$/.test(p)) return true; // all same digits
    if (p === "123456" || p === "654321" || p === "000000") return true;
    const digits = p.split("").map(Number);
    const isSequential = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
    const isReverseSeq = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
    return isSequential || isReverseSeq;
  };

  const handleSetupPinChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 6) {
      setSetupPin(clean);
      if (clean.length === 6) {
        if (isWeakPin(clean)) {
          setFeedback({ type: "warning", message: language === "en" ? "Weak PIN! Avoid simple patterns like 123456 or repeated digits." : "कमज़ोर PIN! 123456 या दोहराए गए अंकों जैसे सरल पैटर्न से बचें।" });
        } else {
          setFeedback({ type: "success", message: language === "en" ? "Strong PIN! Good choice." : "मज़बूत PIN! अच्छा चुनाव।" });
        }
      } else {
        setFeedback({ type: "", message: "" });
      }
    }
  };

  const handleConfirmPinChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 6) {
      setConfirmPin(clean);
      if (clean.length === 6) {
        if (clean === setupPin) {
          setFeedback({ type: "success", message: language === "en" ? "PINs match! Well done." : "PIN मेल खा रहे हैं! बहुत बढ़िया।" });
        } else {
          setFeedback({ type: "error", message: language === "en" ? "PINs do not match. Try again." : "PIN मेल नहीं खा रहे। फिर से कोशिश करें।" });
        }
      } else {
        setFeedback({ type: "", message: "" });
      }
    }
  };

  const canProceedSetup = setupPin.length === 6 && !isWeakPin(setupPin);
  const canProceedConfirm = confirmPin.length === 6 && confirmPin === setupPin;

  // --- Payment PIN pad logic ---
  const handleNumberClick = (num: string) => {
    if (upiPin.length < 4) setUpiPin(prev => prev + num);
  };
  const handleBackspace = () => setUpiPin(prev => prev.slice(0, -1));
  const handlePinSubmit = () => {
    if (upiPin.length === 4) {
      if (step === "pin-entry-scam") {
        setStep("success-report");
      } else if (step === "pin-entry-safe") {
        setStep("success-safe");
        markCompleted("upiCompleted");
      }
    }
  };

  const changeStep = (newStep: PracticeStep) => {
    setUpiPin("");
    setFeedback({ type: "", message: "" });
    setStep(newStep);
  };

  const currentStepNum = getStepNumber(step);

  // --- UPI PIN Pad component ---
  const UpiPinPad = ({ isScam }: { isScam: boolean }) => (
    <div className="bg-[#1a1b1e] fixed bottom-0 w-full left-0 right-0 text-white p-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm font-medium">To: {isScam ? t("toUnknownUser" as any) : t("toGroceryStore" as any)}</p>
          <p className="text-2xl font-bold">₹ {isScam ? "5000" : "500"}</p>
        </div>
        <div className="bg-white p-1 rounded">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" />
        </div>
      </div>

      <div className="bg-[#2c2d30] p-4 rounded-xl mb-6">
        <p className="text-center text-gray-300 text-sm mb-3">{t("enterUpiPin" as any)}</p>
        <div className="flex justify-center gap-4 mb-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-12 bg-[#1a1b1e] rounded-full flex items-center justify-center border border-gray-600">
              {upiPin.length > i ? <div className="w-4 h-4 bg-white rounded-full"></div> : ""}
            </div>
          ))}
        </div>
      </div>

      {isScam && (
        <div className="bg-[#D62828]/20 border border-[#D62828] p-3 rounded-lg mb-4 flex items-start gap-3">
          <AlertTriangle size={24} className="text-[#D62828] shrink-0" />
          <p className="text-sm font-bold text-[#ff8080]">
            {t("pinWillDeduct" as any)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="h-16 text-3xl font-semibold bg-[#2c2d30] active:bg-gray-600 rounded-lg flex items-center justify-center text-white"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="h-16 text-xl font-semibold bg-[#2c2d30] active:bg-gray-600 rounded-lg flex items-center justify-center text-white"
          aria-label="Delete last digit"
        >
          ⌫
        </button>
        <button
          onClick={() => handleNumberClick("0")}
          className="h-16 text-3xl font-semibold bg-[#2c2d30] active:bg-gray-600 rounded-lg flex items-center justify-center text-white"
        >
          0
        </button>
        <button
          onClick={handlePinSubmit}
          className={`h-16 text-xl font-bold rounded-lg flex items-center justify-center ${upiPin.length === 4 ? 'bg-[#3E5F44] text-white shadow-[0_0_15px_rgba(62,95,68,0.5)]' : 'bg-[#2c2d30] text-gray-500'}`}
          disabled={upiPin.length !== 4}
          aria-label="Submit PIN"
        >
          <Check size={32} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-100 flex flex-col relative">
      {/* Header — calm blue-green for Practice mode */}
      <div className="bg-gradient-to-r from-[#03506F] to-[#3E5F44] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
        <button id="tour-back-button" onClick={() => navigate("/practice")} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back to home">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-2xl font-bold flex-1">{t("upiModuleTitle")}</h2>
        <button
          onClick={() => handleSpeak(t("speakPracticeUpi"))}
          className="p-3 bg-white/20 rounded-full shadow-lg active:bg-white/30"
          aria-label="Read instructions aloud"
        >
          <Volume2 size={24} className="text-white" />
        </button>
      </div>

      {/* Step Indicator */}
      {currentStepNum > 0 && (
        <div className="px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#0A043C] font-bold">
              {language === "en" ? `Step ${currentStepNum} of ${TOTAL_STEPS}` : `चरण ${currentStepNum} / ${TOTAL_STEPS}`}
            </span>
            <span className="text-[#03506F] font-bold">{Math.round((currentStepNum / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#03506F] to-[#3E5F44] transition-all duration-500 rounded-full"
              style={{ width: `${(currentStepNum / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ====== PART 1: PIN SETUP SIMULATION ====== */}

          {step === "pin-create" && (
            <motion.div key="pin-create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex flex-col gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-[#03506F] rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Lock size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A043C] mb-2">
                  {language === "en" ? "Create Your 6-Digit PIN" : "अपना 6 अंकों का PIN बनाएं"}
                </h3>
                <p className="text-gray-600 text-lg">
                  {language === "en" ? "Choose a PIN you can remember. Avoid simple patterns." : "ऐसा PIN चुनें जो आपको याद रहे। सरल पैटर्न से बचें।"}
                </p>
              </div>

              {/* PIN Input */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={setupPin}
                  onChange={(e) => handleSetupPinChange(e.target.value)}
                  maxLength={6}
                  className="w-full h-16 px-6 bg-gray-100 text-[#0A043C] text-center text-3xl tracking-[0.5em] rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                  placeholder="••••••"
                  autoFocus
                  aria-label="Enter 6 digit PIN"
                />

                {/* Feedback */}
                {feedback.message && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl mt-4 ${
                      feedback.type === "success"
                        ? "bg-[#3E5F44]/10 border-2 border-[#3E5F44]"
                        : feedback.type === "warning"
                        ? "bg-[#F77F00]/10 border-2 border-[#F77F00]"
                        : "bg-[#D62828]/10 border-2 border-[#D62828]"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2 size={24} className="text-[#3E5F44] shrink-0" />
                    ) : (
                      <AlertTriangle size={24} className={feedback.type === "warning" ? "text-[#F77F00] shrink-0" : "text-[#D62828] shrink-0"} />
                    )}
                    <p className="text-[#0A043C] font-bold">{feedback.message}</p>
                  </div>
                )}

                {/* Tips */}
                <div className="mt-4 bg-[#f4f7f6] p-4 rounded-xl border-l-4 border-[#03506F]">
                  <p className="text-[#122D42] font-bold mb-2">{language === "en" ? "Tips for a strong PIN:" : "मज़बूत PIN के लिए सुझाव:"}</p>
                  <ul className="text-gray-700 space-y-1 text-base">
                    <li>• {language === "en" ? "Don't use 123456 or 000000" : "123456 या 000000 का उपयोग न करें"}</li>
                    <li>• {language === "en" ? "Don't repeat one digit (111111)" : "एक ही अंक न दोहराएं (111111)"}</li>
                    <li>• {language === "en" ? "Don't use your birthday" : "अपनी जन्मतिथि का उपयोग न करें"}</li>
                  </ul>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => {
                  setFeedback({ type: "", message: "" });
                  setStep("pin-confirm");
                }}
                disabled={!canProceedSetup}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                  canProceedSetup
                    ? "bg-[#03506F] text-white active:scale-95 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {language === "en" ? "Next" : "आगे"}
              </button>
            </motion.div>
          )}

          {step === "pin-confirm" && (
            <motion.div key="pin-confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex flex-col gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-[#3E5F44] rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A043C] mb-2">
                  {language === "en" ? "Confirm Your PIN" : "अपने PIN की पुष्टि करें"}
                </h3>
                <p className="text-gray-600 text-lg">
                  {language === "en" ? "Enter your PIN again to confirm." : "पुष्टि करने के लिए अपना PIN फिर से दर्ज करें।"}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => handleConfirmPinChange(e.target.value)}
                  maxLength={6}
                  className="w-full h-16 px-6 bg-gray-100 text-[#0A043C] text-center text-3xl tracking-[0.5em] rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                  placeholder="••••••"
                  autoFocus
                  aria-label="Confirm 6 digit PIN"
                />

                {feedback.message && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl mt-4 ${
                      feedback.type === "success"
                        ? "bg-[#3E5F44]/10 border-2 border-[#3E5F44]"
                        : "bg-[#D62828]/10 border-2 border-[#D62828]"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2 size={24} className="text-[#3E5F44] shrink-0" />
                    ) : (
                      <AlertTriangle size={24} className="text-[#D62828] shrink-0" />
                    )}
                    <p className="text-[#0A043C] font-bold">{feedback.message}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setFeedback({ type: "", message: "" });
                  setStep("pin-done");
                }}
                disabled={!canProceedConfirm}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                  canProceedConfirm
                    ? "bg-[#03506F] text-white active:scale-95 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {language === "en" ? "Confirm" : "पुष्टि करें"}
              </button>
            </motion.div>
          )}

          {step === "pin-done" && (
            <motion.div key="pin-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-[#3E5F44] rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-[#0A043C] text-center">
                {language === "en" ? "PIN Set Successfully!" : "PIN सफलतापूर्वक सेट हो गया!"}
              </h3>
              <p className="text-gray-600 text-lg text-center">
                {language === "en" ? "You created a strong, secure UPI PIN." : "आपने एक मजबूत, सुरक्षित UPI PIN बनाया।"}
              </p>

              {/* What you learned */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 w-full">
                <h4 className="text-lg font-bold text-[#0A043C] mb-3">
                  {language === "en" ? "What you learned:" : "आपने क्या सीखा:"}
                </h4>
                <ul className="space-y-3">
                  {[
                    { en: "Avoid simple patterns like 123456", hi: "123456 जैसे सरल पैटर्न से बचें" },
                    { en: "Create a strong 6-digit PIN", hi: "एक मज़बूत 6 अंकों का PIN बनाएं" },
                    { en: "Always confirm your PIN carefully", hi: "हमेशा अपने PIN की सावधानीपूर्वक पुष्टि करें" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-[#3E5F44] shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{language === "en" ? item.en : item.hi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Continue to Part 2 */}
              <div className="bg-[#03506F]/10 border-2 border-[#03506F] rounded-2xl p-5 w-full text-center">
                <p className="text-[#0A043C] font-bold text-lg mb-1">
                  {language === "en" ? "Next: Practice Safe Payments" : "अगला: सुरक्षित भुगतान का अभ्यास"}
                </p>
                <p className="text-gray-600">
                  {language === "en" ? "Learn when to enter your PIN and when NOT to." : "जानें कि अपना PIN कब डालना है और कब नहीं।"}
                </p>
              </div>

              <button
                onClick={() => changeStep("fake-request-view")}
                className="w-full py-4 bg-[#03506F] text-white text-xl font-bold rounded-xl active:scale-95 transition-transform shadow-lg"
              >
                {language === "en" ? "Continue" : "जारी रखें"}
              </button>
            </motion.div>
          )}

          {/* ====== PART 2: PAYMENT SCAM SIMULATION ====== */}

          {step === "fake-request-view" && (
            <motion.div key="fake-request" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 flex flex-col items-center gap-6 relative pt-12">
              <div className="absolute top-4 left-0 w-full text-center px-4">
                <span className="bg-[#122D42] text-white px-4 py-2 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 mx-auto w-max">
                  <Info size={18} /> {t("simulation" as any)}
                </span>
              </div>

              {/* Fake GPay style request screen */}
              <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden mt-6">
                <div className="bg-[#1a73e8] p-8 flex flex-col items-center text-white">
                  <div className="w-20 h-20 bg-white text-[#1a73e8] rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg border-4 border-[#1a73e8]/50">
                    A
                  </div>
                  <h3 className="text-2xl font-bold">Amit Kumar</h3>
                  <p className="text-blue-100 text-lg mt-1">+91 98765 43210</p>
                </div>

                <div className="p-6 bg-gray-50 flex flex-col items-center">
                  <p className="text-gray-600 font-bold mb-2">{t("requestingMoney" as any)}</p>
                  <h2 className="text-5xl font-extrabold text-[#202124] mb-2">₹5,000</h2>
                  <div className="bg-white w-full p-4 rounded-xl shadow-sm border border-gray-200 mt-4 mb-8">
                    <p className="text-gray-800 text-lg italic">
                      {language === "en"
                        ? '"Hi, I am sending your lottery money. Just enter PIN to receive ₹5000 in your bank."'
                        : '"नमस्ते, मैं आपको लॉटरी के पैसे भेज रहा हूँ। बस अपने बैंक में ₹5000 प्राप्त करने के लिए PIN दर्ज करें।"'}
                    </p>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => {
                        handleSpeak(t("neverSharePin"));
                        changeStep("safe-send");
                      }}
                      className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 text-lg active:bg-gray-100"
                      aria-label="Decline the payment request"
                    >
                      {t("decline" as any)}
                    </button>
                    <button
                      onClick={() => changeStep("pin-entry-scam")}
                      className="flex-1 py-4 bg-[#1a73e8] text-white rounded-xl font-bold text-lg shadow-md active:bg-blue-700"
                      aria-label="Pay the requested amount"
                    >
                      {t("pay")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#F77F00] w-full">
                <div className="flex gap-3">
                  <button onClick={() => handleSpeak(t("whatShouldYouDo"))} className="bg-[#F77F00] p-3 rounded-full shrink-0 h-min" aria-label="Read hint aloud">
                    <Volume2 size={24} className="text-white" />
                  </button>
                  <p className="text-[#0A043C] font-bold text-lg">
                    {t("whatShouldYouDo" as any)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === "pin-entry-scam" && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm" role="dialog" aria-label="UPI PIN entry - scam scenario" aria-modal="true">
              <UpiPinPad isScam={true} />
            </div>
          )}

          {step === "success-report" && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="p-6 flex flex-col items-center justify-center h-full bg-[#D62828] text-white text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={48} className="text-[#D62828]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {language === "en" ? "Oops! Money Deducted." : "ओह! पैसे कट गए।"}
              </h2>
              <p className="text-xl mb-8 font-medium">
                {language === "en"
                  ? "You entered your PIN on a request. This sends money OUT of your bank. You never enter PIN to receive money."
                  : "आपने अनुरोध पर अपना PIN डाला। इससे आपके बैंक से पैसे बाहर जाते हैं। पैसे प्राप्त करने के लिए कभी PIN न डालें।"}
              </p>
              <button
                onClick={() => changeStep("fake-request-view")}
                className="w-full py-4 bg-white text-[#D62828] text-xl font-bold rounded-xl active:bg-gray-100"
              >
                {t("tryAgain")}
              </button>
            </motion.div>
          )}

          {step === "safe-send" && (
            <motion.div key="safe-send" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 flex flex-col items-center gap-6 relative pt-12">
              <div className="absolute top-4 left-0 w-full text-center px-4">
                <span className="bg-[#122D42] text-white px-4 py-2 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 mx-auto w-max">
                  <Info size={18} /> {t("simulation" as any)}
                </span>
              </div>

              <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden mt-6 border-4 border-[#3E5F44]/20">
                <div className="bg-[#3E5F44] p-8 flex flex-col items-center text-white">
                  <div className="w-20 h-20 bg-white text-[#3E5F44] rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                    <ShieldCheck size={40} className="text-[#3E5F44]" />
                  </div>
                  <h3 className="text-2xl font-bold">{t("toGroceryStore" as any)}</h3>
                  <p className="text-green-100 text-lg mt-1">{language === "en" ? "Verified Merchant" : "सत्यापित व्यापारी"}</p>
                </div>

                <div className="p-6 bg-gray-50 flex flex-col items-center">
                  <p className="text-gray-600 font-bold mb-2">{t("youArePaying" as any)}</p>
                  <h2 className="text-5xl font-extrabold text-[#202124] mb-8">₹500</h2>

                  <button
                    onClick={() => changeStep("pin-entry-safe")}
                    className="w-full py-4 bg-[#03506F] text-white rounded-xl font-bold text-xl shadow-md active:bg-[#122D42] flex items-center justify-center gap-3"
                  >
                    <Banknote size={24} />
                    {language === "en" ? "Pay ₹500" : "₹500 चुकाएं"}
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#03506F] w-full">
                <div className="flex gap-3">
                  <button onClick={() => handleSpeak(t("nowAtShop"))} className="bg-[#03506F] p-3 rounded-full shrink-0 h-min" aria-label="Read hint aloud">
                    <Volume2 size={24} className="text-white" />
                  </button>
                  <p className="text-[#0A043C] font-bold text-lg">
                    {t("nowAtShop" as any)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === "pin-entry-safe" && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm" role="dialog" aria-label="UPI PIN entry - safe payment" aria-modal="true">
              <UpiPinPad isScam={false} />
            </div>
          )}

          {step === "success-safe" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 flex flex-col items-center justify-center h-full bg-[#3E5F44] text-white text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                <Check size={64} strokeWidth={4} className="text-[#3E5F44]" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">
                {language === "en" ? "Payment Safe & Successful!" : "भुगतान सुरक्षित और सफल!"}
              </h2>
              <p className="text-xl mb-12 font-medium px-4">
                {language === "en"
                  ? "Excellent! You only entered your PIN because YOU chose to send money."
                  : "उत्कृष्ट! आपने केवल इसलिए अपना PIN दर्ज किया क्योंकि आपने पैसे भेजने का विकल्प चुना था।"}
              </p>
              <button
                onClick={() => navigate("/practice")}
                className="w-full max-w-[250px] py-4 bg-white text-[#3E5F44] text-xl font-bold rounded-xl active:bg-gray-100 shadow-xl"
              >
                {t("home")}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
