import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import { KeyRound, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

function getStrength(p: string, t: (k: string) => string): { level: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (p.length >= 12) score++;
  if (score <= 1) return { level: score, label: t("weak"), color: "#D62828" };
  if (score <= 3) return { level: score, label: t("medium"), color: "#F77F00" };
  return { level: score, label: t("strong"), color: "#3E5F44" };
}

export function Password() {
  const { t, markCompleted } = useApp();
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const strength = getStrength(password, t);
  const checks = [
    { pass: password.length >= 8, key: "pwdReq1" },
    { pass: /[A-Z]/.test(password), key: "pwdReq2" },
    { pass: /[0-9]/.test(password), key: "pwdReq3" },
    { pass: /[^A-Za-z0-9]/.test(password), key: "pwdReq4" },
  ];

  return (
    <StepModule
      title={t("passwordTitle")}
      backPath="/practice"
      speakKey="pwdSpeak"
      onComplete={() => markCompleted("passwordCompleted")}
      successTitleKey="pwdSuccessTitle"
      successMsgKey="pwdSuccessMsg"
      learningKeys={["pwdLearn1", "pwdLearn2", "pwdLearn3"]}
      steps={[
        {
          titleKey: "pwdStepCreate",
          canProceed: strength.level >= 3,
          content: (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-4">
                <div className="flex items-center gap-3">
                  <KeyRound size={24} className="text-[#03506F]" />
                  <span className="text-[#0A043C] font-bold text-lg">{t("yourPassword")}</span>
                </div>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 px-4 pr-14 bg-gray-100 text-[#0A043C] text-xl rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                    placeholder={t("typePasswordHere")} />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2">
                    {showPwd ? <EyeOff size={24} className="text-gray-400" /> : <Eye size={24} className="text-gray-400" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-500">{t("strength")}</span>
                      <span className="text-sm font-bold" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(strength.level / 5) * 100}%`, backgroundColor: strength.color }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-3">
                <p className="font-bold text-[#0A043C]">{t("requirements")}</p>
                {checks.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {c.pass ? <CheckCircle2 size={20} className="text-[#3E5F44]" /> : <XCircle size={20} className="text-gray-300" />}
                    <span className={`text-base ${c.pass ? "text-[#3E5F44] font-medium" : "text-gray-500"}`}>{t(c.key)}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          titleKey: "pwdStepConfirm",
          canProceed: confirmPwd === password && confirmPwd.length > 0,
          content: (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-4">
              <p className="text-gray-600 text-lg text-center">{t("typePasswordAgain")}</p>
              <input type="password" value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full h-16 px-4 bg-gray-100 text-[#0A043C] text-xl rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                placeholder="••••••••" />
              {confirmPwd.length > 0 && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${confirmPwd === password ? "bg-[#3E5F44]/10 border border-[#3E5F44]" : "bg-[#D62828]/10 border border-[#D62828]"}`}>
                  {confirmPwd === password ? <CheckCircle2 size={20} className="text-[#3E5F44]" /> : <XCircle size={20} className="text-[#D62828]" />}
                  <span className="font-bold">{confirmPwd === password ? t("passwordsMatch") : t("passwordsNoMatch")}</span>
                </div>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
