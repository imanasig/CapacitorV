import { useApp } from "../../context/AppContext";
import { ScenarioModule } from "../../components/ScenarioModule";
import { Star } from "lucide-react";

export function FakeApp() {
  const { t, markCompleted } = useApp();

  return (
    <ScenarioModule
      title={t("fakeAppTitle")}
      backPath="/safety"
      speakKey="faSpeak"
      onComplete={() => markCompleted("fakeAppCompleted")}
      scenarios={[
        {
          scenarioContent: (
            <div className="p-4 space-y-3">
              <p className="text-[#0A043C] font-bold mb-2">{t("wantInstallGpay")}</p>
              {[
                { name: "Google Pay", dev: "Google LLC", dl: "500M+", rating: "4.3" },
                { name: "G-Pay Money Transfer", dev: "GPay Services Ltd", dl: "10K+", rating: "4.9" },
              ].map((app, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600">{i === 0 ? "G" : "₹"}</div>
                  <div className="flex-1">
                    <p className="font-bold text-[#0A043C]">{app.name}</p>
                    <p className="text-gray-500 text-sm">{app.dev}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400"><Star size={10} className="text-[#F77F00]" />{app.rating} · {app.dl}</div>
                  </div>
                </div>
              ))}
            </div>
          ),
          questionKey: "faQ1",
          choices: [
            { textKey: "faC1a", isCorrect: true },
            { textKey: "faC1b", isCorrect: false },
          ],
          explanationKey: "faE1",
        },
        {
          scenarioContent: (
            <div className="p-4">
              <p className="text-[#0A043C] font-bold mb-3">{t("friendSendsLink")}</p>
              <div className="bg-[#e5ddd5] rounded-xl p-4">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm">
                  <p className="text-gray-800">"Bro download this app for free recharge! bit.ly/freerechg"</p>
                </div>
              </div>
            </div>
          ),
          questionKey: "faQ2",
          choices: [
            { textKey: "faC2a", isCorrect: false },
            { textKey: "faC2b", isCorrect: true },
            { textKey: "faC2c", isCorrect: false },
          ],
          explanationKey: "faE2",
        },
      ]}
    />
  );
}
