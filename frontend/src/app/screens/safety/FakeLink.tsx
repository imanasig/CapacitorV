import { useApp } from "../../context/AppContext";
import { ScenarioModule } from "../../components/ScenarioModule";

export function FakeLink() {
  const { t, markCompleted } = useApp();

  return (
    <ScenarioModule
      title={t("fakeLinkTitle")}
      backPath="/safety"
      speakKey="flSpeak"
      onComplete={() => markCompleted("fakeLinkCompleted")}
      scenarios={[
        {
          scenarioContent: (
            <div className="p-4 bg-[#f0f2f5]">
              <p className="text-xs text-gray-500 mb-2">SMS</p>
              <p className="text-gray-800 text-lg leading-relaxed">
                "Your KYC is expiring! Update now: http://sbi-kyc-update.xyz/verify or your account will be blocked."
              </p>
            </div>
          ),
          questionKey: "flQ1",
          choices: [
            { textKey: "flC1a", isCorrect: false },
            { textKey: "flC1b", isCorrect: true },
          ],
          explanationKey: "flE1",
        },
        {
          scenarioContent: (
            <div className="p-4">
              <p className="text-[#0A043C] font-bold mb-3">{t("whichRealUrl")}</p>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-base">https://www.india.gov.in</div>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-base">https://india-gov.org.free</div>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-base">http://govt-india-services.com</div>
              </div>
            </div>
          ),
          questionKey: "flQ2",
          choices: [
            { textKey: "flC2a", isCorrect: true },
            { textKey: "flC2b", isCorrect: false },
            { textKey: "flC2c", isCorrect: false },
          ],
          explanationKey: "flE2",
        },
      ]}
    />
  );
}
