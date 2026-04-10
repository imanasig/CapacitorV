import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { BookOpen, ShieldAlert, Volume2, ShieldCheck, Trophy, ArrowRight, Phone } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const { t, speak, progress } = useApp();
  const navigate = useNavigate();

  const totalModules = Object.keys(progress).length;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const practiceCount = [progress.upiCompleted, progress.sendMoneyCompleted, progress.qrPayCompleted, progress.passwordCompleted, progress.installAppCompleted, progress.symbolLiteracyCompleted].filter(Boolean).length;
  const safetyCount = [progress.smsCompleted, progress.chatCompleted, progress.otpScamCompleted, progress.fakeLinkCompleted, progress.fakeAppCompleted, progress.socialEngCompleted].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6] overflow-y-auto">
      <div className="bg-[#0A043C] text-white p-6 rounded-b-3xl shadow-lg relative">
        <button
          onClick={() => speak(t("speakWelcome"))}
          className="absolute top-4 right-4 bg-white/20 p-3 rounded-full active:scale-95 transition-all shadow-md"
          aria-label="Read Welcome Message"
        >
          <Volume2 size={28} className="text-white" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={40} className="text-[#F77F00]" />
          <h2 className="text-2xl font-bold leading-tight">{t("welcome")}</h2>
        </div>
        <p className="text-lg text-gray-200 mt-2 pr-12 font-medium">{t("welcomeSub")}</p>
        <div className="mt-4 bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 w-max">
          <Trophy size={18} className="text-[#F77F00]" />
          <span className="text-white font-bold text-sm">{completedCount}/{totalModules} {t("completedLabel")}</span>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <button id="tour-emergency" onClick={() => navigate("/emergency-contacts")} className="w-full text-left active:scale-[0.98] transition-transform" aria-label="Emergency Contacts">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#D62828] to-[#9B1515] p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-1">Emergency Contacts</h3>
                  <p className="text-white/80 text-base">Helplines, fraud & cyber crime numbers</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-gray-500 text-base font-medium">Tap any number to call instantly</span>
                <div className="flex items-center gap-2 text-[#D62828] font-bold">
                  <span>View All</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button id="tour-practice" onClick={() => navigate("/practice")} className="w-full text-left active:scale-[0.98] transition-transform" aria-label={t("practiceModeTitle")}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#03506F] to-[#3E5F44] p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-1">{t("practiceModeTitle")}</h3>
                  <p className="text-white/80 text-base">{t("practiceModeSub")}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-gray-500 text-base font-medium">{practiceCount}/6 {t("skills")}</span>
                <div className="flex items-center gap-2 text-[#03506F] font-bold">
                  <span>{t("practiceModeAction")}</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button id="tour-safety" onClick={() => navigate("/safety")} className="w-full text-left active:scale-[0.98] transition-transform" aria-label={t("riskModeTitle")}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#F77F00] to-[#D62828] p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-1">{t("riskModeTitle")}</h3>
                  <p className="text-white/80 text-base">{t("riskModeSub")}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-gray-500 text-base font-medium">{safetyCount}/6 {t("challenges")}</span>
                <div className="flex items-center gap-2 text-[#D62828] font-bold">
                  <span>{t("riskModeAction")}</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0A043C] rounded-2xl p-5 flex items-start gap-4">
          <ShieldCheck size={28} className="text-[#F77F00] shrink-0 mt-1" />
          <p className="text-white/90 text-base leading-relaxed font-medium">{t("safeSpaceTip")}</p>
        </motion.div>
      </div>
    </div>
  );
}
