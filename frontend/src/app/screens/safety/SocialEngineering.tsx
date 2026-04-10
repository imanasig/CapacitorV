import { useApp } from "../../context/AppContext";
import { ScenarioModule } from "../../components/ScenarioModule";
import { Phone } from "lucide-react";

export function SocialEngineering() {
  const { t, markCompleted } = useApp();

  return (
    <ScenarioModule
      title={t("socialEngTitle")}
      backPath="/safety"
      speakKey="seSpeak"
      onComplete={() => markCompleted("socialEngCompleted")}
      scenarios={[
        {
          scenarioContent: (
            <div className="p-4 bg-[#e5ddd5]">
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-gray-800 text-lg leading-relaxed">
                  "Hi Uncle, I am Priya from electricity department. Your power will be cut in 30 minutes if you don't pay ₹500 fine right now. Send to this UPI: elec.fine@upi"
                </p>
              </div>
            </div>
          ),
          questionKey: "seQ1",
          choices: [
            { textKey: "seC1a", isCorrect: false },
            { textKey: "seC1b", isCorrect: true },
            { textKey: "seC1c", isCorrect: false },
          ],
          explanationKey: "seE1",
        },
        {
          scenarioContent: (
            <div className="p-4 bg-[#f0f2f5]">
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-xs text-[#D62828] font-bold mb-1 flex items-center gap-1"><Phone size={12} /> {t("phoneCall")}</p>
                <p className="text-gray-800 text-lg leading-relaxed">
                  "This is the police cyber cell. We found your Aadhaar number is being used for illegal activity. You must transfer ₹10,000 security deposit or we will arrest you today."
                </p>
              </div>
            </div>
          ),
          questionKey: "seQ2",
          choices: [
            { textKey: "seC2a", isCorrect: false },
            { textKey: "seC2b", isCorrect: true },
          ],
          explanationKey: "seE2",
        },
      ]}
    />
  );
}
