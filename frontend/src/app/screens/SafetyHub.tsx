import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ShieldAlert, MessageSquareWarning, Phone, Link2, Download, UserX, Volume2, CheckCircle2, ArrowRight, PhoneCall, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function SafetyHub() {
  const { t, speak, progress, language } = useApp();
  const navigate = useNavigate();

  const challenges = [
    { path: "/detect", icon: MessageSquareWarning, titleKey: "smsChallenge", descKey: "smsChallengeDesc", completed: progress.smsCompleted, gradient: "from-[#FF8C42] to-[#FF7043]" },
    { path: "/detect-deepfakes", icon: ShieldAlert, titleKey: "deepfakesChallenge", descKey: "deepfakesChallengeDesc", completed: progress.deepfakesCompleted, gradient: "from-[#FF7043] to-[#FF5722]" },
    { path: "/chat", icon: Phone, titleKey: "chatChallenge", descKey: "chatChallengeDesc", completed: progress.chatCompleted, gradient: "from-[#FF5722] to-[#E64A19]" },
    { path: "/safety/otp-scam", icon: ShieldAlert, titleKey: "otpScamTitle", descKey: "otpScamDesc", completed: progress.otpScamCompleted, gradient: "from-[#E64A19] to-[#D62828]" },
    { path: "/safety/fake-link", icon: Link2, titleKey: "fakeLinkTitle", descKey: "fakeLinkDesc", completed: progress.fakeLinkCompleted, gradient: "from-[#D62828] to-[#C1121F]" },
    { path: "/safety/fake-app", icon: Download, titleKey: "fakeAppTitle", descKey: "fakeAppDesc", completed: progress.fakeAppCompleted, gradient: "from-[#C1121F] to-[#9B2226]" },
    { path: "/safety/social-eng", icon: UserX, titleKey: "socialEngTitle", descKey: "socialEngDesc", completed: progress.socialEngCompleted, gradient: "from-[#9B2226] to-[#6A040F]" },
  ];

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6] overflow-y-auto">
      <div className="bg-gradient-to-br from-[#F77F00] to-[#D62828] text-white p-6 rounded-b-3xl shadow-lg relative">
        <button
          onClick={() => speak(t("speakSafetyHub"))}
          className="absolute top-4 right-4 bg-white/20 p-3 rounded-full active:scale-95 shadow-md" aria-label="Read aloud"
        >
          <Volume2 size={28} className="text-white" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert size={40} className="text-white" />
          <h2 className="text-2xl font-bold leading-tight">{t("safetyHubTitle")}</h2>
        </div>
        <p className="text-lg text-white/80 mt-2 pr-12 font-medium">{t("safetyHubSub")}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="bg-white/10 rounded-full px-4 py-2 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-white" />
            <span className="text-white font-bold text-sm">{completedCount}/{challenges.length} {t("completed")}</span>
          </div>
          <button
            id="tour-back-button"
            onClick={() => navigate("/emergency-contacts")}
            className="w-10 h-10 bg-white/15 border border-white/30 rounded-full flex items-center justify-center active:bg-white/30"
            aria-label="Emergency Contacts"
          >
            <PhoneCall size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-3">
        <h3 className="text-xl font-extrabold text-[#0A043C] px-1">{t("challenges")}</h3>
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          return (
            <motion.div key={challenge.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <button 
                id={`tour-safety-item-${index}`}
                onClick={() => navigate(challenge.path)} 
                className="w-full text-left active:scale-[0.98] transition-transform" 
                aria-label={t(challenge.titleKey)}
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className={`bg-gradient-to-r ${challenge.gradient} p-4 flex items-center gap-4`}>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={28} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-lg font-bold">{t(challenge.titleKey)}</h4>
                      <p className="text-white/75 text-sm">{t(challenge.descKey)}</p>
                    </div>
                    {challenge.completed ? (
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#D62828]/10 border-2 border-[#D62828]/30 rounded-2xl p-4 flex items-start gap-3 mt-2">
          <ShieldAlert size={24} className="text-[#D62828] shrink-0 mt-0.5" />
          <p className="text-[#0A043C] text-base font-medium">
            {t("safetyTip")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
