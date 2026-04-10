import { useApp } from "../context/AppContext";
import { Trophy, BookOpen, ShieldAlert, Star, ArrowRight, Volume2, CheckCircle2, Phone } from "lucide-react";
import { useNavigate } from "react-router";

export function Progress() {
  const { t, progress, speak } = useApp();
  const navigate = useNavigate();

  const practiceModules = [
    { titleKey: "setUpiPin", completed: progress.upiCompleted, path: "/practice/upi-pin" },
    { titleKey: "sendMoneyTitle", completed: progress.sendMoneyCompleted, path: "/practice/send-money" },
    { titleKey: "qrPayTitle", completed: progress.qrPayCompleted, path: "/practice/qr-pay" },
    { titleKey: "passwordTitle", completed: progress.passwordCompleted, path: "/practice/password" },
    { titleKey: "installAppTitle", completed: progress.installAppCompleted, path: "/practice/install-app" },
    { titleKey: "symbolLiteracyTitle", completed: progress.symbolLiteracyCompleted, path: "/practice/symbols" },
    { titleKey: "aadhaarTitle", completed: progress.aadhaarCompleted, path: "/practice/aadhaar" },
  ];

  const safetyModules = [
    { titleKey: "smsChallenge", completed: progress.smsCompleted, path: "/detect" },
    { titleKey: "chatChallenge", completed: progress.chatCompleted, path: "/chat" },
    { titleKey: "otpScamTitle", completed: progress.otpScamCompleted, path: "/safety/otp-scam" },
    { titleKey: "fakeLinkTitle", completed: progress.fakeLinkCompleted, path: "/safety/fake-link" },
    { titleKey: "fakeAppTitle", completed: progress.fakeAppCompleted, path: "/safety/fake-app" },
    { titleKey: "socialEngTitle", completed: progress.socialEngCompleted, path: "/safety/social-eng" },
  ];

  const totalCompleted = Object.values(progress).filter(Boolean).length;
  const totalModules = Object.keys(progress).length;
  const totalPoints = totalCompleted * 100;

  const renderModuleList = (modules: typeof practiceModules) => (
    <div className="space-y-2">
      {modules.map((mod, i) => (
        <div
          key={i}
          onClick={() => !mod.completed && navigate(mod.path)}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
            mod.completed ? "bg-[#3E5F44]/10 border-[#3E5F44]" : "bg-gray-50 border-gray-200 cursor-pointer active:bg-gray-100"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mod.completed ? "bg-[#3E5F44]" : "bg-gray-300"}`}>
            {mod.completed ? <CheckCircle2 size={20} className="text-white" /> : <Star size={20} className="text-gray-500" />}
          </div>
          <div className="flex-1">
            <h4 className={`text-base font-bold ${mod.completed ? "text-[#3E5F44]" : "text-gray-700"}`}>
              {t(mod.titleKey)}
            </h4>
            <p className="text-sm text-gray-500">
              {mod.completed ? t("hundredPoints") : t("tapToStart")}
            </p>
          </div>
          {!mod.completed && <ArrowRight size={18} className="text-gray-400" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[#f4f7f6] flex flex-col overflow-y-auto">
      <div id="tour-progress-summary" className="bg-[#0A043C] text-white p-6 rounded-b-3xl shadow-lg flex flex-col items-center pt-8 pb-10">
        <div className="w-20 h-20 bg-[#03506F] rounded-full border-4 border-[#F77F00] flex items-center justify-center shadow-2xl mb-3 relative">
          <Trophy size={40} className="text-[#F77F00]" />
          {totalCompleted === totalModules && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">PRO</div>
          )}
        </div>
        <h2 className="text-2xl font-extrabold mb-1">{t("progressTitle")}</h2>
        <p className="text-lg text-blue-200">
          {t("points")} <span className="text-[#F77F00] font-bold text-xl">{totalPoints}</span>
        </p>
        <div className="w-full mt-4 px-2">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F77F00] to-[#3E5F44] rounded-full transition-all duration-500" style={{ width: `${(totalCompleted / totalModules) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-white/70 text-sm">{totalCompleted}/{totalModules} {t("completedLabel")}</p>
            <button
              id="tour-back-button"
              onClick={() => navigate("/emergency-contacts")}
              className="w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center active:bg-white/25"
              aria-label="Emergency Contacts"
            >
              <Phone size={18} className="text-[#F77F00]" />
            </button>
          </div>
        </div>
        <button
          onClick={() => speak(t("speakProgress"))}
          className="mt-3 p-3 bg-[#F77F00] rounded-full shadow-lg active:bg-[#F77F00]/80" aria-label="Read progress aloud"
        >
          <Volume2 size={22} className="text-white" />
        </button>
      </div>

      <div className="p-4 flex-1 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={22} className="text-[#03506F]" />
            <h3 className="text-lg font-bold text-[#0A043C]">{t("practiceModeTitle")}</h3>
            <span className="ml-auto text-sm font-bold text-[#03506F]">{practiceModules.filter(m => m.completed).length}/5</span>
          </div>
          {renderModuleList(practiceModules)}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={22} className="text-[#D62828]" />
            <h3 className="text-lg font-bold text-[#0A043C]">{t("riskModeTitle")}</h3>
            <span className="ml-auto text-sm font-bold text-[#D62828]">{safetyModules.filter(m => m.completed).length}/6</span>
          </div>
          {renderModuleList(safetyModules)}
        </div>

        {totalCompleted === totalModules && (
          <div className="bg-[#122D42] text-white p-5 rounded-2xl shadow-xl border-l-8 border-[#F77F00] flex items-start gap-4">
            <Trophy size={36} className="text-[#F77F00] shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-1">{t("digitalGuardian")}</h3>
              <p className="text-gray-300 leading-snug">{t("digitalGuardianDesc")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
