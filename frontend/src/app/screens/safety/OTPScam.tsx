import { useApp } from "../../context/AppContext";
import { ScenarioModule } from "../../components/ScenarioModule";
import { Phone } from "lucide-react";

export function OTPScam() {
  const { t, markCompleted } = useApp();

  return (
    <ScenarioModule
      title={t("otpScamTitle")}
      backPath="/safety"
      speakKey="otpSpeak"
      onComplete={() => markCompleted("otpScamCompleted")}
      scenarios={[
        {
          scenarioContent: (
            <div className="p-4 bg-[#f0f2f5]">
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-xs text-[#D62828] font-bold mb-1 flex items-center gap-1"><Phone size={12} /> {t("incomingCall")}</p>
                <p className="text-gray-800 text-lg leading-relaxed">
                  "Hello sir, this is SBI Bank. Your account has been hacked. Please share your OTP immediately so we can secure it."
                </p>
              </div>
            </div>
          ),
          questionKey: "otpQ1",
          choices: [
            { textKey: "otpC1a", isCorrect: false },
            { textKey: "otpC1b", isCorrect: true },
            { textKey: "otpC1c", isCorrect: false },
          ],
          explanationKey: "otpE1",
        },
        {
          scenarioContent: (
            <div className="p-4 bg-[#f0f2f5] space-y-3">
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-xs text-gray-500 mb-1">SMS</p>
                <p className="text-gray-800 text-lg leading-relaxed">
                  "Your OTP for ₹5000 transfer is 847291. DO NOT share this with anyone. - SBI Bank"
                </p>
              </div>
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-xs text-[#D62828] font-bold mb-1"><Phone size={12} className="inline" /> {t("callAgain")}</p>
                <p className="text-gray-800 text-lg">"Sir, please read me the OTP that just came. It is for securing your account."</p>
              </div>
            </div>
          ),
          questionKey: "otpQ2",
          choices: [
            { textKey: "otpC2a", isCorrect: false },
            { textKey: "otpC2b", isCorrect: true },
          ],
          explanationKey: "otpE2",
        },
      ]}
    />
  );
}
