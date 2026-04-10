import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Volume2, ArrowLeft, ShieldAlert, CheckCircle2, XCircle, ChevronRight, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Message = {
  id: string;
  sender: string;
  time: string;
  enText: string;
  hiText: string;
  isScam: boolean;
  enExplanation: string;
  hiExplanation: string;
};

const messages: Message[] = [
  {
    id: "m1",
    sender: "BZ-ELECBD",
    time: "10:30 AM",
    enText: "Dear Customer, your electricity power will be disconnected tonight at 9:30 PM. Update your KYC immediately by clicking: http://updt-kyc-xyz.com or call 9876543210.",
    hiText: "प्रिय ग्राहक, आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। कृपया तुरंत अपना KYC अपडेट करें: http://updt-kyc-xyz.com या 9876543210 पर कॉल करें।",
    isScam: true,
    enExplanation: "Electricity boards never send disconnection warnings from personal numbers with unverified links. This creates fake urgency to make you panic.",
    hiExplanation: "बिजली बोर्ड कभी भी व्यक्तिगत नंबरों से असत्यापित लिंक के साथ चेतावनी नहीं भेजते हैं। यह आपको घबराने के लिए फर्जी जल्दबाजी पैदा करता है।"
  },
  {
    id: "m2",
    sender: "AD-HDFCBK",
    time: "Yesterday",
    enText: "Your OTP for Rs 5000 debit at Amazon is 54321. Do NOT share this OTP with anyone. Bank never calls to ask for OTP.",
    hiText: "Amazon पर 5000 रुपये के लिए आपका OTP 54321 है। इस OTP को किसी के साथ साझा न करें। बैंक कभी भी OTP मांगने के लिए कॉल नहीं करता है।",
    isScam: false,
    enExplanation: "This is a legitimate OTP message. It clearly states the purpose and warns you not to share it.",
    hiExplanation: "यह एक वैध OTP संदेश है। यह स्पष्ट रूप से उद्देश्य बताता है और आपको इसे साझा न करने की चेतावनी देता है।"
  },
  {
    id: "m3",
    sender: "+91 88888 88888",
    time: "Yesterday",
    enText: "Congratulations! Your mobile number has won a lottery of ₹25,00,000. Send WhatsApp message on this number to claim prize.",
    hiText: "बधाई हो! आपके मोबाइल नंबर ने ₹25,00,000 की लॉटरी जीती है। इनाम पाने के लिए इस नंबर पर WhatsApp संदेश भेजें।",
    isScam: true,
    enExplanation: "You never win a lottery you didn't enter. Scammers use greed to trick you into paying a 'processing fee'.",
    hiExplanation: "आप कभी ऐसी लॉटरी नहीं जीतते जिसमें आपने भाग नहीं लिया। स्कैमर लालच का इस्तेमाल करके आपसे 'प्रोसेसिंग फीस' वसूलते हैं।"
  }
];

export function Detect() {
  const { t, language, speak, markCompleted } = useApp();
  const navigate = useNavigate();
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [result, setResult] = useState<"none" | "correct" | "incorrect">("none");

  const handleSpeak = (text: string) => speak(text);

  const handleChoice = (isScamChoice: boolean) => {
    if (!selectedMsg) return;
    
    if (isScamChoice === selectedMsg.isScam) {
      setResult("correct");
      markCompleted("smsCompleted");
    } else {
      setResult("incorrect");
    }
  };

  const closeMessage = () => {
    setSelectedMsg(null);
    setResult("none");
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col relative">
      <div className="bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
        <button id="tour-back-button" onClick={() => navigate("/safety")} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back to safety hub">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-2xl font-bold flex-1">{t("smsModuleTitle")}</h2>
        <button
          onClick={() => handleSpeak(t("speakDetect"))}
          className="p-3 bg-white/20 rounded-full shadow-lg active:bg-white/30"
          aria-label="Read instructions aloud"
        >
          <Volume2 size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedMsg ? (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-start gap-4">
              <ShieldAlert size={36} className="text-[#03506F] shrink-0" />
              <p className="text-[#122D42] font-bold text-lg">
                {t("lookAtInbox" as any)}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-[#f0f2f5] p-4 border-b border-gray-200 flex items-center gap-3">
                <MessageSquareText size={24} className="text-[#0A043C]" />
                <h3 className="text-xl font-bold text-[#0A043C]">Messages</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsg(msg)}
                    className="p-4 flex gap-4 active:bg-blue-50 cursor-pointer transition-colors"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open message from ${msg.sender}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMsg(msg); }}
                  >
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-gray-600 font-bold text-xl">{msg.sender.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-lg text-gray-900 truncate pr-2">{msg.sender}</h4>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{msg.time}</span>
                      </div>
                      <p className="text-gray-600 text-base line-clamp-2 leading-snug">
                        {language === 'en' ? msg.enText : msg.hiText}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-[#f0f2f5] p-4 flex items-center gap-4 border-b border-gray-200">
                <button onClick={closeMessage} className="p-3 active:bg-gray-200 rounded-full" aria-label="Go back to inbox">
                  <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-bold">{selectedMsg.sender.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMsg.sender}</h3>
              </div>

              <div className="p-5 bg-[#e5ddd5]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {language === 'en' ? selectedMsg.enText : selectedMsg.hiText}
                  </p>
                  <span className="text-xs text-gray-500 block text-right mt-2">{selectedMsg.time}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleSpeak(language === "en" ? selectedMsg.enText : selectedMsg.hiText)} className="bg-white p-4 rounded-full shadow-md active:bg-gray-100 flex items-center gap-2" aria-label="Read message aloud">
                    <Volume2 size={20} className="text-[#03506F]" />
                    <span className="text-[#03506F] font-bold text-sm">{t("read" as any)}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
                {result === "none" ? (
                  <>
                    <h4 className="text-2xl font-bold text-center text-[#0A043C] mb-6">
                      {t("isThisSafeOrScam" as any)}
                    </h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleChoice(true)}
                        className="flex-1 py-4 bg-[#D62828] text-white rounded-xl font-bold text-xl active:bg-red-700 flex flex-col items-center justify-center gap-2 shadow-md"
                        aria-label="Mark this message as a scam"
                      >
                        <ShieldAlert size={32} />
                        {t("scam")}
                      </button>
                      <button
                        onClick={() => handleChoice(false)}
                        className="flex-1 py-4 bg-[#3E5F44] text-white rounded-xl font-bold text-xl active:bg-green-700 flex flex-col items-center justify-center gap-2 shadow-md"
                        aria-label="Mark this message as safe"
                      >
                        <CheckCircle2 size={32} />
                        {t("safe")}
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="text-center">
                    <div className="flex justify-center mb-4">
                      {result === "correct" ? (
                        <div className="w-20 h-20 bg-[#3E5F44]/20 rounded-full flex items-center justify-center border-4 border-[#3E5F44]">
                          <CheckCircle2 size={48} className="text-[#3E5F44]" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-[#D62828]/20 rounded-full flex items-center justify-center border-4 border-[#D62828]">
                          <XCircle size={48} className="text-[#D62828]" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className={`text-2xl font-bold mb-4 ${result === "correct" ? "text-[#3E5F44]" : "text-[#D62828]"}`}>
                      {result === "correct" 
                        ? (language === 'en' ? "Correct!" : "सही!") 
                        : (language === 'en' ? "Incorrect" : "गलत")}
                    </h4>
                    
                    <p className="text-lg text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 leading-snug">
                      {language === 'en' ? selectedMsg.enExplanation : selectedMsg.hiExplanation}
                    </p>
                    
                    <button 
                      onClick={closeMessage}
                      className="w-full py-4 bg-[#03506F] text-white rounded-xl font-bold text-xl active:bg-[#122D42] shadow-md"
                    >
                      {t("backToInbox" as any)}
                    </button>
                  </motion.div>
                )}
              </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
