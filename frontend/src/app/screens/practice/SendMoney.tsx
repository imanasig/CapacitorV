import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import { User, IndianRupee, CheckCircle2 } from "lucide-react";

export function SendMoney() {
  const { t, markCompleted } = useApp();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  return (
    <StepModule
      title={t("sendMoneyTitle")}
      backPath="/practice"
      speakKey="smSpeak"
      onComplete={() => markCompleted("sendMoneyCompleted")}
      successTitleKey="smSuccessTitle"
      successMsgKey="smSuccessMsg"
      learningKeys={["smLearn1", "smLearn2", "smLearn3"]}
      steps={[
        {
          titleKey: "smStepRecipient",
          canProceed: recipient.length === 10,
          content: (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <User size={24} className="text-[#03506F]" />
                <span className="text-[#0A043C] font-bold text-lg">{t("mobileNumber")}</span>
              </div>
              <input type="tel" inputMode="numeric" value={recipient}
                onChange={(e) => setRecipient(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full h-16 px-4 bg-gray-100 text-[#0A043C] text-xl tracking-wider rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                placeholder="9876543210" />
              {recipient.length === 10 && (
                <div className="bg-[#3E5F44]/10 border border-[#3E5F44] rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#3E5F44]" />
                  <span className="text-[#3E5F44] font-bold">{t("ramuStore")}</span>
                </div>
              )}
            </div>
          ),
        },
        {
          titleKey: "smStepAmount",
          canProceed: Number(amount) > 0 && Number(amount) <= 10000,
          content: (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <IndianRupee size={24} className="text-[#03506F]" />
                <span className="text-[#0A043C] font-bold text-lg">{t("amountLabel")}</span>
              </div>
              <input type="tel" inputMode="numeric" value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="w-full h-16 px-4 bg-gray-100 text-[#0A043C] text-3xl font-bold text-center rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                placeholder="500" />
              <div className="flex gap-2">
                {[100, 500, 1000].map((v) => (
                  <button key={v} onClick={() => setAmount(String(v))} className="flex-1 py-3 bg-[#03506F]/10 rounded-xl text-[#03506F] font-bold active:bg-[#03506F]/20">₹{v}</button>
                ))}
              </div>
            </div>
          ),
        },
        {
          titleKey: "smStepPin",
          canProceed: pin.length === 4,
          content: (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 text-center">
                <p className="text-gray-500 mb-1">{t("sendingTo")}</p>
                <p className="text-[#0A043C] font-bold text-xl">{t("ramuStore")}</p>
                <p className="text-3xl font-extrabold text-[#03506F] mt-2">₹{amount || "0"}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
                <p className="text-center text-gray-500 mb-3 font-bold">{t("enterUpiPin")}</p>
                <input type="password" inputMode="numeric" value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full h-16 px-4 bg-gray-100 text-[#0A043C] text-3xl text-center tracking-[0.5em] rounded-xl border-2 border-[#03506F] focus:outline-none focus:ring-4 focus:ring-[#03506F]/20"
                  placeholder="••••" />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
