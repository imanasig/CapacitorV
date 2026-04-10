import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useApp } from "../context/AppContext";
import {
  Volume2, ArrowLeft, Phone, MoreVertical, Send, UserX, AlertCircle,
  MessageSquareText, Mail, MessageCircle, Instagram, Facebook, PhoneCall,
  Hash, Star, Reply, ChevronDown, Video, Search, Archive, Trash2,
  MoreHorizontal, Heart, Bookmark, Share2, CheckCheck, Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ChatStep = "intro" | "chat1" | "chat2" | "decision" | "fail" | "success";
type Platform = "whatsapp" | "sms" | "email" | "instagram" | "facebook" | "telegram" | "phone_call";

const BACK_STATE = { state: { activeTab: "simulations" } };

export function CommunityQuiz() {
  const { t, language, speak } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const customWarning = location.state?.customWarning;
  const [step, setStep] = useState<ChatStep>("intro");

  const isCustom = !!customWarning;
  const dynScenario = customWarning?.scenario?.scenario || [];
  const rawPlatform = customWarning?.scenario?.platform || "whatsapp";
  const platform: Platform = (
    ["whatsapp", "sms", "email", "instagram", "facebook", "telegram", "phone_call"].includes(rawPlatform)
      ? rawPlatform : "whatsapp"
  ) as Platform;

  const msg1 = dynScenario[0] || { en: "Hi there, I have an urgent matter.", hi: "नमस्ते, एक जरूरी बात है।" };
  const msg2 = dynScenario[1] || { en: "Please respond immediately or face consequences.", hi: "तुरंत जवाब दें नहीं तो परिणाम होंगे।" };
  const msg3Raw = dynScenario[2];
  const msg3 = (msg3Raw && (msg3Raw.en || "").trim()) ? msg3Raw : null;

  const safeChoiceEn = customWarning?.scenario?.safe_choice_en || "Report and block";
  const safeChoiceHi = customWarning?.scenario?.safe_choice_hi || "रिपोर्ट करें और ब्लॉक करें";
  const dangerChoiceEn = customWarning?.scenario?.danger_choice_en || "Follow their instructions";
  const dangerChoiceHi = customWarning?.scenario?.danger_choice_hi || "उनके निर्देशों का पालन करें";

  const lang = language === "en";
  const goBack = () => navigate("/community-siren", BACK_STATE);

  // ─────────────────────────────────────────────────────────────────────────────
  // Decision Panel - shared across platforms
  const DecisionPanel = ({ color }: { color: string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="mt-auto bg-white p-4 rounded-3xl shadow-2xl border-2" style={{ borderColor: color }}>
      <h4 className="text-xl font-bold text-center text-[#0A043C] mb-4">{t("whatWillYouDo" as any)}</h4>
      <div className="flex flex-col gap-3">
        <button onClick={() => setStep("success")} style={{ backgroundColor: color }}
          className="w-full py-4 px-4 text-white rounded-xl font-bold text-lg text-left shadow-md flex items-center justify-between active:scale-[0.98]">
          <span>{lang ? safeChoiceEn : safeChoiceHi}</span>
          <Phone size={20} />
        </button>
        <button onClick={() => setStep("fail")}
          className="w-full py-4 px-4 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg text-left shadow-sm border border-gray-200 flex items-center justify-between active:bg-red-50 active:scale-[0.98]">
          <span>{lang ? dangerChoiceEn : dangerChoiceHi}</span>
          <Send size={20} className="text-gray-400" />
        </button>
      </div>
    </motion.div>
  );

  // Result screens - shared
  const FailScreen = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full bg-white rounded-3xl p-6 shadow-2xl text-center border-4 border-[#D62828] mx-2">
      <div className="w-20 h-20 bg-[#D62828]/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={48} className="text-[#D62828]" />
      </div>
      <h2 className="text-3xl font-bold text-[#D62828] mb-4">{t("youLostMoney" as any)}</h2>
      <p className="text-xl font-medium text-gray-700 mb-5 leading-snug">{t("youLostMoneyDesc" as any)}</p>

      {/* Simple helpline nudge */}
      <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">If this happened to you in real life, call for help now:</p>
        <div className="flex gap-2 justify-center">
          <a href="tel:1930"
            className="flex-1 bg-white border border-green-200 rounded-xl py-2.5 text-center shadow-sm active:bg-green-50">
            <p className="text-green-700 font-extrabold text-lg">1930</p>
            <p className="text-gray-500 text-[11px] font-medium">Cyber Crime</p>
          </a>
          <a href="tel:14440"
            className="flex-1 bg-white border border-green-200 rounded-xl py-2.5 text-center shadow-sm active:bg-green-50">
            <p className="text-green-700 font-extrabold text-lg">14440</p>
            <p className="text-gray-500 text-[11px] font-medium">RBI Fraud</p>
          </a>
        </div>
      </div>

      <button onClick={goBack} className="w-full py-4 bg-[#0A043C] text-white text-xl font-bold rounded-xl shadow-md">Back to Alerts</button>
    </motion.div>
  );

  const SuccessScreen = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full bg-white rounded-3xl p-6 shadow-2xl text-center border-4 border-[#3E5F44] mx-2">
      <div className="w-20 h-20 bg-[#3E5F44]/10 rounded-full flex items-center justify-center mb-4">
        <UserX size={48} className="text-[#3E5F44]" />
      </div>
      <h2 className="text-3xl font-bold text-[#3E5F44] mb-4">{t("scamAvoided" as any)}</h2>
      <p className="text-xl font-medium text-gray-700 mb-8 leading-snug">{t("scamAvoidedDesc" as any)}</p>
      <button onClick={goBack} className="w-full py-4 bg-[#3E5F44] text-white text-xl font-bold rounded-xl shadow-md">Back to Alerts</button>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // WHATSAPP
  if (platform === "whatsapp") {
    return (
      <div className="h-full flex flex-col bg-[#efeae2]">
        {/* WhatsApp header */}
        <div className="bg-[#075E54] text-white px-2 py-2 flex items-center gap-2 shadow-md shrink-0 z-10">
          <button onClick={goBack} className="p-2 active:bg-white/10 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">?</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">Unknown Number</p>
            <p className="text-[11px] text-green-200 leading-tight">online</p>
          </div>
          <div className="flex items-center gap-4 pr-1 text-white">
            <Video size={20} />
            <Phone size={20} />
            <MoreVertical size={20} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
          style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: "cover" }}>
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5">
                <div className="bg-[#fff3c4] border-2 border-yellow-300 rounded-2xl p-5 text-center max-w-[90%] shadow-lg">
                  <MessageSquareText size={44} className="text-[#128C7E] mx-auto mb-3" />
                  <p className="text-xl font-extrabold text-[#0A043C] mb-1">{isCustom ? customWarning.title : "WhatsApp Scam"}</p>
                  <span className="text-[10px] bg-[#128C7E] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">WHATSAPP SIMULATION</span>
                  <p className="text-gray-700 text-sm mt-3">{isCustom ? customWarning.description : "An unknown contact is messaging you."}</p>
                </div>
                <button onClick={() => setStep("chat1")} className="w-[200px] py-4 bg-[#128C7E] text-white text-lg font-bold rounded-xl shadow-lg active:scale-95">{t("start")}</button>
              </motion.div>
            )}

            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex justify-center my-1">
                  <span className="bg-[#E1F3FB] text-gray-500 text-xs px-3 py-1 rounded-full">Today</span>
                </div>
                {/* Scammer bubble */}
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="max-w-[80%]">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px] leading-snug">{lang ? msg1.en : msg1.hi}</p>
                    <p className="text-[10px] text-gray-400 text-right mt-1">10:41 AM</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }} className="max-w-[80%]">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px] leading-snug">{lang ? msg2.en : msg2.hi}</p>
                    <p className="text-[10px] text-gray-400 text-right mt-1">10:42 AM</p>
                  </div>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="max-w-[80%]">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <p className="text-gray-900 text-[15px] leading-snug">{lang ? msg3.en : msg3.hi}</p>
                      <p className="text-[10px] text-gray-400 text-right mt-1">10:43 AM</p>
                    </div>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && <DecisionPanel color="#128C7E" />}
              </div>
            )}
            {step === "fail" && <FailScreen />}
            {step === "success" && <SuccessScreen />}
          </AnimatePresence>
        </div>

        {/* WhatsApp input bar */}
        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-[#F0F0F0] px-2 py-2 flex items-center gap-2 shrink-0">
            <div className="bg-white flex-1 rounded-full px-4 py-2.5 text-gray-400 text-sm shadow-sm opacity-60 cursor-not-allowed select-none">Type a message</div>
            <button onClick={() => speak(t("speakSimulator"))} className="w-11 h-11 bg-[#128C7E] rounded-full flex items-center justify-center text-white shrink-0 shadow active:scale-95">
              <Volume2 size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SMS (iOS-style)
  if (platform === "sms") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* iOS SMS header */}
        <div className="bg-white border-b border-gray-200 px-3 pt-3 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <button onClick={goBack} className="flex items-center gap-0.5 text-blue-500 font-medium text-[15px] active:opacity-60">
              <ArrowLeft size={20} className="text-blue-500" />Messages
            </button>
            <MoreHorizontal size={22} className="text-blue-500" />
          </div>
          <div className="flex flex-col items-center pb-1">
            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mb-1">
              <span className="text-2xl font-bold text-gray-500">?</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">+91 98765 43210</p>
            <p className="text-xs text-blue-500 mt-0.5">Unknown Sender · Possible Scam</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 py-3 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center max-w-[90%] shadow">
                  <MessageCircle size={44} className="text-blue-500 mx-auto mb-3" />
                  <p className="text-xl font-extrabold text-[#0A043C] mb-1">{isCustom ? customWarning.title : "SMS Scam"}</p>
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">SMS SIMULATION</span>
                  <p className="text-gray-600 text-sm mt-3">{isCustom ? customWarning.description : "You received a suspicious text."}</p>
                </div>
                <button onClick={() => setStep("chat1")} className="w-[200px] py-4 bg-blue-500 text-white text-lg font-bold rounded-xl shadow-lg active:scale-95">{t("start")}</button>
              </motion.div>
            )}

            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex justify-center mb-1">
                  <span className="text-gray-400 text-xs">Today 10:41 AM</span>
                </div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="max-w-[80%]">
                  <div className="bg-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                    <p className="text-gray-900 text-[15px]">{lang ? msg1.en : msg1.hi}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 ml-2 mt-0.5">Delivered</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }} className="max-w-[80%]">
                  <div className="bg-gray-200 rounded-2xl px-4 py-3">
                    <p className="text-gray-900 text-[15px]">{lang ? msg2.en : msg2.hi}</p>
                  </div>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="max-w-[80%]">
                    <div className="bg-gray-200 rounded-2xl px-4 py-3">
                      <p className="text-gray-900 text-[15px]">{lang ? msg3.en : msg3.hi}</p>
                    </div>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && <DecisionPanel color="#3B82F6" />}
              </div>
            )}
            {step === "fail" && <FailScreen />}
            {step === "success" && <SuccessScreen />}
          </AnimatePresence>
        </div>

        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
            <div className="bg-gray-100 flex-1 rounded-full px-4 py-2.5 text-gray-400 text-sm opacity-60 cursor-not-allowed select-none">iMessage</div>
            <button onClick={() => speak(t("speakSimulator"))} className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white active:scale-95">
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GMAIL
  if (platform === "email") {
    const emailTitle = isCustom ? customWarning.title : "Urgent Action Required";
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Gmail top bar */}
        <div className="bg-white border-b border-gray-200 px-2 py-2 flex items-center gap-2 shrink-0">
          <button onClick={goBack} className="p-2 text-gray-600 active:bg-gray-100 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <p className="flex-1 font-semibold text-gray-800 text-[15px] truncate">{emailTitle}</p>
          <Archive size={20} className="text-gray-500 mx-1" />
          <Trash2 size={20} className="text-gray-500 mx-1" />
          <MoreVertical size={20} className="text-gray-500 mx-1" />
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5 p-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 text-center max-w-[90%] shadow">
                  {/* Gmail M logo */}
                  <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#D44638"/>
                    </svg>
                  </div>
                  <p className="text-xl font-extrabold text-[#0A043C] mb-1">{emailTitle}</p>
                  <span className="text-[10px] bg-[#D44638] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">GMAIL SIMULATION</span>
                  <p className="text-gray-600 text-sm mt-3">{isCustom ? customWarning.description : "A suspicious email has arrived in your inbox."}</p>
                </div>
                <button onClick={() => setStep("chat1")} className="w-[200px] py-4 bg-[#D44638] text-white text-lg font-bold rounded-xl shadow-lg active:scale-95">{t("start")}</button>
              </motion.div>
            )}

            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col">
                {/* Email subject + sender card */}
                <div className="px-4 pt-4 pb-2">
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3">{emailTitle}</h2>
                  <div className="flex items-start gap-3">
                    {/* Sender avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#D44638] flex items-center justify-center text-white font-bold text-base shrink-0">S</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold text-gray-900 text-sm">Security Team</p>
                        <p className="text-xs text-gray-500 shrink-0">10:41 AM</p>
                      </div>
                      <p className="text-xs text-gray-500">alert@secure-update.com</p>
                      <p className="text-xs text-gray-400">to me</p>
                    </div>
                    <div className="flex gap-2 pt-1 shrink-0">
                      <Star size={18} className="text-gray-400" />
                      <Reply size={18} className="text-gray-400" />
                      <MoreVertical size={18} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 mt-3" />
                </div>

                {/* Email body */}
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-800 text-[15px] leading-relaxed">
                    {lang ? msg1.en : msg1.hi}
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }}
                    className="text-gray-800 text-[15px] leading-relaxed font-medium">
                    {lang ? msg2.en : msg2.hi}
                  </motion.p>
                  {step === "chat2" && msg3 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                      onAnimationComplete={() => setStep("decision")}
                      className="text-gray-800 text-[15px] leading-relaxed">
                      {lang ? msg3.en : msg3.hi}
                    </motion.p>
                  )}
                  {step === "chat2" && !msg3 && setStep("decision")}

                  {/* Fake signature */}
                  <p className="text-gray-500 text-sm mt-1 border-t border-gray-100 pt-3">
                    Regards,<br />
                    <span className="font-semibold text-gray-700">Security Verification Team</span>
                  </p>

                  {/* Gmail reply strip */}
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                      <Reply size={14} /> Reply
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700">Forward</button>
                  </div>
                </div>

                {step === "decision" && (
                  <div className="px-4 pb-4">
                    <DecisionPanel color="#D44638" />
                  </div>
                )}
              </div>
            )}
            {step === "fail" && <div className="p-4 h-full flex items-center"><FailScreen /></div>}
            {step === "success" && <div className="p-4 h-full flex items-center"><SuccessScreen /></div>}
          </AnimatePresence>
        </div>

        {/* Gmail bottom bar */}
        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-3 shrink-0">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-sm opacity-60 cursor-not-allowed select-none">Reply to this email…</div>
            <button onClick={() => speak(t("speakSimulator"))} className="w-10 h-10 bg-[#D44638] rounded-full flex items-center justify-center text-white active:scale-95">
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INSTAGRAM DM
  if (platform === "instagram") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Instagram DM header */}
        <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-3 shrink-0">
          <button onClick={goBack} className="p-1.5 active:bg-gray-100 rounded-full text-black">
            <ArrowLeft size={22} />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">?</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">someone_official_ig</p>
            <p className="text-[11px] text-gray-500">Active now</p>
          </div>
          <Phone size={22} className="text-gray-800 mx-1" />
          <Video size={22} className="text-gray-800 mx-1" />
          <MoreHorizontal size={22} className="text-gray-800" />
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 py-3 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5">
                <div className="bg-gradient-to-b from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-5 text-center max-w-[90%] shadow">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                    <Instagram size={30} className="text-white" />
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1">{isCustom ? customWarning.title : "Instagram DM Scam"}</p>
                  <span className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">INSTAGRAM DM</span>
                  <p className="text-gray-600 text-sm mt-3">{isCustom ? customWarning.description : "Someone suspicious is messaging you."}</p>
                </div>
                <button onClick={() => setStep("chat1")}
                  className="w-[200px] py-4 text-white text-lg font-bold rounded-xl shadow-lg active:scale-95 bg-gradient-to-r from-pink-500 to-purple-600">{t("start")}</button>
              </motion.div>
            )}
            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col gap-2 h-full">
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center"><span className="text-[10px] font-bold text-gray-500">?</span></div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                    <p className="text-gray-900 text-[15px]">{lang ? msg1.en : msg1.hi}</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }}
                  className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center"><span className="text-[10px] font-bold text-gray-500">?</span></div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <p className="text-gray-900 text-[15px]">{lang ? msg2.en : msg2.hi}</p>
                  </div>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center"><span className="text-[10px] font-bold text-gray-500">?</span></div>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <p className="text-gray-900 text-[15px]">{lang ? msg3.en : msg3.hi}</p>
                    </div>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && <DecisionPanel color="#C13584" />}
              </div>
            )}
            {step === "fail" && <FailScreen />}
            {step === "success" && <SuccessScreen />}
          </AnimatePresence>
        </div>

        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
            <div className="bg-gray-100 flex-1 rounded-full px-4 py-2.5 text-gray-400 text-sm opacity-60 cursor-not-allowed select-none">Message…</div>
            <Heart size={22} className="text-gray-500" />
            <button onClick={() => speak(t("speakSimulator"))} className="w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-95 bg-gradient-to-r from-pink-500 to-purple-600">
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FACEBOOK MESSENGER
  if (platform === "facebook") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-white border-b border-gray-200 px-2 py-2.5 flex items-center gap-2 shrink-0">
          <button onClick={goBack} className="p-1.5 text-[#1877F2] active:bg-blue-50 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
            <Facebook size={20} className="text-[#1877F2]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">Facebook Support</p>
            <p className="text-[11px] text-green-500 font-medium">● Active now</p>
          </div>
          <Phone size={22} className="text-[#1877F2] mx-1" />
          <Video size={22} className="text-[#1877F2] mx-1" />
          <MoreHorizontal size={22} className="text-[#1877F2]" />
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F0F2F5] px-4 py-3 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center max-w-[90%] shadow">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#1877F2] rounded-full flex items-center justify-center">
                    <Facebook size={30} className="text-white" />
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1">{isCustom ? customWarning.title : "Facebook Messenger Scam"}</p>
                  <span className="text-[10px] bg-[#1877F2] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">MESSENGER SIMULATION</span>
                  <p className="text-gray-600 text-sm mt-3">{isCustom ? customWarning.description : "You received a suspicious Messenger message."}</p>
                </div>
                <button onClick={() => setStep("chat1")} className="w-[200px] py-4 bg-[#1877F2] text-white text-lg font-bold rounded-xl shadow-lg active:scale-95">{t("start")}</button>
              </motion.div>
            )}
            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex justify-center mb-1"><span className="text-gray-400 text-xs">Today, 10:41 AM</span></div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-1.5 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center shrink-0"><Facebook size={13} className="text-[#1877F2]" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px]">{lang ? msg1.en : msg1.hi}</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }}
                  className="flex items-end gap-1.5 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center shrink-0"><Facebook size={13} className="text-[#1877F2]" /></div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px]">{lang ? msg2.en : msg2.hi}</p>
                  </div>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="flex items-end gap-1.5 max-w-[80%]">
                    <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center shrink-0"><Facebook size={13} className="text-[#1877F2]" /></div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                      <p className="text-gray-900 text-[15px]">{lang ? msg3.en : msg3.hi}</p>
                    </div>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && <DecisionPanel color="#1877F2" />}
              </div>
            )}
            {step === "fail" && <FailScreen />}
            {step === "success" && <SuccessScreen />}
          </AnimatePresence>
        </div>

        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2 shrink-0">
            <div className="bg-[#F0F2F5] flex-1 rounded-full px-4 py-2.5 text-gray-400 text-sm opacity-60 cursor-not-allowed select-none">Aa</div>
            <Share2 size={20} className="text-[#1877F2]" />
            <button onClick={() => speak(t("speakSimulator"))} className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white active:scale-95">
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TELEGRAM
  if (platform === "telegram") {
    return (
      <div className="h-full flex flex-col bg-[#efeded]">
        <div className="bg-[#2AABEE] text-white px-2 py-2.5 flex items-center gap-2 shrink-0">
          <button onClick={goBack} className="p-1.5 active:bg-white/10 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Hash size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Telegram Channel</p>
            <p className="text-[11px] text-blue-100">12,487 subscribers</p>
          </div>
          <Search size={20} className="mx-1" />
          <MoreVertical size={20} />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-5">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 text-center max-w-[90%] shadow">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#2AABEE] rounded-full flex items-center justify-center">
                    <Hash size={28} className="text-white" />
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1">{isCustom ? customWarning.title : "Telegram Scam"}</p>
                  <span className="text-[10px] bg-[#2AABEE] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">TELEGRAM SIMULATION</span>
                  <p className="text-gray-600 text-sm mt-3">{isCustom ? customWarning.description : "A suspicious Telegram channel contacted you."}</p>
                </div>
                <button onClick={() => setStep("chat1")} className="w-[200px] py-4 bg-[#2AABEE] text-white text-lg font-bold rounded-xl shadow-lg active:scale-95">{t("start")}</button>
              </motion.div>
            )}
            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex justify-center mb-1"><span className="bg-[#5c5c5c]/30 text-white text-xs px-3 py-0.5 rounded-full">Today</span></div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="max-w-[82%]">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px]">{lang ? msg1.en : msg1.hi}</p>
                    <p className="text-[10px] text-gray-400 text-right mt-1 flex items-center justify-end gap-1">10:41 <CheckCheck size={13} className="text-[#2AABEE]" /></p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }} className="max-w-[82%]">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <p className="text-gray-900 text-[15px]">{lang ? msg2.en : msg2.hi}</p>
                    <p className="text-[10px] text-gray-400 text-right mt-1 flex items-center justify-end gap-1">10:42 <CheckCheck size={13} className="text-[#2AABEE]" /></p>
                  </div>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="max-w-[82%]">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                      <p className="text-gray-900 text-[15px]">{lang ? msg3.en : msg3.hi}</p>
                    </div>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && <DecisionPanel color="#2AABEE" />}
              </div>
            )}
            {step === "fail" && <FailScreen />}
            {step === "success" && <SuccessScreen />}
          </AnimatePresence>
        </div>

        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
            <div className="bg-gray-100 flex-1 rounded-full px-4 py-2.5 text-gray-400 text-sm opacity-60 cursor-not-allowed select-none">Write a message...</div>
            <button onClick={() => speak(t("speakSimulator"))} className="w-10 h-10 bg-[#2AABEE] rounded-full flex items-center justify-center text-white active:scale-95">
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PHONE CALL (iOS-style dark)
  if (platform === "phone_call") {
    return (
      <div className="h-full flex flex-col bg-[#1c1c1e] relative">
        <div className="absolute top-5 left-4">
          <button onClick={goBack} className="p-2 bg-white/10 rounded-full active:bg-white/20">
            <ArrowLeft size={22} className="text-white" />
          </button>
        </div>

        {/* Status bar area */}
        <div className="flex justify-end pr-4 pt-3 gap-3 shrink-0">
          <Wifi size={14} className="text-white" />
        </div>

        {/* Caller info */}
        <div className="flex flex-col items-center px-6 pt-4 shrink-0">
          <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-3 shadow-2xl">
            <PhoneCall size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Unknown</h2>
          <p className="text-gray-400 text-sm mt-0.5">+91 XXXXX XXXXX · India</p>
          {step === "intro" && <p className="text-green-400 text-sm font-medium mt-1 animate-pulse">Incoming Call…</p>}
          {(step !== "intro" && step !== "fail" && step !== "success") && (
            <p className="text-green-400 text-sm font-medium mt-1">Connected</p>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-4 gap-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center gap-4 max-w-sm">
                <div className="bg-[#2c2c2e] rounded-2xl p-4 w-full text-center border border-white/10">
                  <p className="text-gray-300 text-sm leading-relaxed">{isCustom ? customWarning.description : "An unknown caller is trying to reach you."}</p>
                </div>
                {/* Answer/Decline */}
                <div className="flex gap-12 mt-2">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={goBack} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-95">
                      <Phone size={28} className="text-white rotate-[135deg]" />
                    </button>
                    <span className="text-white text-xs">Decline</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => setStep("chat1")} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg active:scale-95">
                      <Phone size={28} className="text-white" />
                    </button>
                    <span className="text-white text-xs">Accept</span>
                  </div>
                </div>
              </motion.div>
            )}

            {(step === "chat1" || step === "chat2" || step === "decision") && (
              <div className="w-full flex flex-col gap-3 max-w-sm">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#2c2c2e] border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-300 text-sm mb-1 font-medium">🔊 Caller says:</p>
                  <p className="text-white text-[15px] leading-relaxed">"{lang ? msg1.en : msg1.hi}"</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                  onAnimationComplete={() => { if (step === "chat1") setStep("chat2"); }}
                  className="bg-[#2c2c2e] border border-white/10 rounded-2xl p-4">
                  <p className="text-white text-[15px] leading-relaxed">"{lang ? msg2.en : msg2.hi}"</p>
                </motion.div>
                {step === "chat2" && msg3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    onAnimationComplete={() => setStep("decision")} className="bg-[#2c2c2e] border border-white/10 rounded-2xl p-4">
                    <p className="text-white text-[15px] leading-relaxed">"{lang ? msg3.en : msg3.hi}"</p>
                  </motion.div>
                )}
                {step === "chat2" && !msg3 && setStep("decision")}
                {step === "decision" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2c2c2e] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-white font-bold text-center mb-4">What will you do?</h4>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setStep("success")} className="w-full py-3 bg-green-500 text-white rounded-xl font-bold text-left px-4 active:scale-[0.98]">
                        {lang ? safeChoiceEn : safeChoiceHi}
                      </button>
                      <button onClick={() => setStep("fail")} className="w-full py-3 bg-[#3a3a3c] text-white rounded-xl font-bold text-left px-4 border border-white/10 active:scale-[0.98]">
                        {lang ? dangerChoiceEn : dangerChoiceHi}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {step === "fail" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-400">{t("youLostMoney" as any)}</h2>
                <p className="text-gray-300">{t("youLostMoneyDesc" as any)}</p>
                <button onClick={goBack} className="w-full py-4 bg-red-500 text-white text-lg font-bold rounded-xl mt-2">Back to Alerts</button>
              </motion.div>
            )}
            {step === "success" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <UserX size={48} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-green-400">{t("scamAvoided" as any)}</h2>
                <p className="text-gray-300">{t("scamAvoidedDesc" as any)}</p>
                <button onClick={goBack} className="w-full py-4 bg-green-500 text-white text-lg font-bold rounded-xl mt-2">Back to Alerts</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call controls */}
        {(step === "chat1" || step === "chat2" || step === "decision") && (
          <div className="shrink-0 px-6 pb-6 flex justify-center gap-8">
            <button onClick={() => speak(t("speakSimulator"))} className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 bg-[#3a3a3c] rounded-full flex items-center justify-center active:bg-white/20">
                <Volume2 size={24} className="text-white" />
              </div>
              <span className="text-white text-xs">Speaker</span>
            </button>
            <button onClick={goBack} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center active:scale-95">
                <Phone size={30} className="text-white rotate-[135deg]" />
              </div>
              <span className="text-white text-xs">End</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Fallback (should never reach)
  return null;
}
