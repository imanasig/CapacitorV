import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { BookOpen, CreditCard, Send, QrCode, KeyRound, Download, ShoppingBag, Shapes, Fingerprint, Volume2, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function PracticeHub() {
  const { t, speak, progress, language } = useApp();
  const navigate = useNavigate();

  const modules = [
    { path: "/practice/upi-pin", icon: CreditCard, titleKey: "setUpiPin", descKey: "setUpiPinDesc", completed: progress.upiCompleted, gradient: "from-[#03506F] to-[#046380]" },
    { path: "/practice/send-money", icon: Send, titleKey: "sendMoneyTitle", descKey: "sendMoneyDesc", completed: progress.sendMoneyCompleted, gradient: "from-[#046380] to-[#057A6F]" },
    { path: "/practice/qr-pay", icon: QrCode, titleKey: "qrPayTitle", descKey: "qrPayDesc", completed: progress.qrPayCompleted, gradient: "from-[#057A6F] to-[#3E5F44]" },
    { path: "/practice/password", icon: KeyRound, titleKey: "passwordTitle", descKey: "passwordDesc", completed: progress.passwordCompleted, gradient: "from-[#3E5F44] to-[#2D7D46]" },
    { path: "/practice/install-app", icon: Download, titleKey: "installAppTitle", descKey: "installAppDesc", completed: progress.installAppCompleted, gradient: "from-[#2D7D46] to-[#3E5F44]" },
    { path: "/practice/order-blinkit", icon: ShoppingBag, titleKey: "orderBlinkitTitle", descKey: "orderBlinkitDesc", completed: progress.orderBlinkitCompleted, gradient: "from-[#F77F00] to-[#E36414]" },
    { path: "/practice/symbol-literacy", icon: Shapes, titleKey: "symbolLiteracyTitle", descKey: "symbolLiteracyDesc", completed: progress.symbolLiteracyCompleted, gradient: "from-[#7B2D8E] to-[#5B21B6]" },
    { path: "/practice/aadhaar", icon: Fingerprint, titleKey: "aadhaarTitle", descKey: "aadhaarDesc", completed: progress.aadhaarCompleted, gradient: "from-[#0369A1] to-[#0284C7]" },
  ];

  const completedCount = modules.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6] overflow-y-auto">
      <div className="bg-gradient-to-br from-[#03506F] to-[#3E5F44] text-white p-6 rounded-b-3xl shadow-lg relative">
        <button
          onClick={() => speak(t("speakPracticeHub"))}
          className="absolute top-4 right-4 bg-white/20 p-3 rounded-full active:scale-95 shadow-md"
          aria-label="Read instructions aloud"
        >
          <Volume2 size={28} className="text-white" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={40} className="text-white" />
          <h2 className="text-2xl font-bold leading-tight">{t("practiceHubTitle")}</h2>
        </div>
        <p className="text-lg text-white/80 mt-2 pr-12 font-medium">{t("practiceHubSub")}</p>
        <div className="mt-3 bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 w-max">
          <CheckCircle2 size={18} className="text-white" />
          <span className="text-white font-bold text-sm">{completedCount}/{modules.length} {t("completed")}</span>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-3">
        <h3 className="text-xl font-extrabold text-[#0A043C] px-1">{t("skills")}</h3>
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <button
                id={`tour-practice-item-${index}`}
                onClick={() => navigate(mod.path)}
                className="w-full text-left active:scale-[0.98] transition-transform"
                aria-label={t(mod.titleKey)}
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className={`bg-gradient-to-r ${mod.gradient} p-4 flex items-center gap-4`}>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={28} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-lg font-bold">{t(mod.titleKey)}</h4>
                      <p className="text-white/75 text-sm">{t(mod.descKey)}</p>
                    </div>
                    {mod.completed ? (
                      <CheckCircle2 size={24} className="text-white shrink-0" />
                    ) : (
                      <ArrowRight size={24} className="text-white/60 shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#03506F]/10 border-2 border-[#03506F]/20 rounded-2xl p-4 flex items-start gap-3 mt-2">
          <BookOpen size={24} className="text-[#03506F] shrink-0 mt-0.5" />
          <p className="text-[#0A043C] text-base font-medium">
            {t("practiceTip")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
