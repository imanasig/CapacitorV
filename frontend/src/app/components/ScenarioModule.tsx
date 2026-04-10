import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface Choice {
  textKey: string;
  isCorrect: boolean;
}

export interface ScenarioStep {
  scenarioContent: React.ReactNode;
  questionKey: string;
  choices: Choice[];
  explanationKey: string;
}

interface ScenarioModuleProps {
  title: string;
  backPath: string;
  scenarios: ScenarioStep[];
  onComplete: () => void;
  speakKey: string;
}

export function ScenarioModule({ title, backPath, scenarios, onComplete, speakKey }: ScenarioModuleProps) {
  const { speak, t } = useApp();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = scenarios[current];

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (scenario.choices[index].isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < scenarios.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      onComplete();
      setComplete(true);
    }
  };

  if (complete) {
    const allCorrect = score === scenarios.length;
    return (
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
          <button id="tour-back-button" onClick={() => navigate(backPath)} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back"><ArrowLeft size={28} /></button>
          <h2 className="text-2xl font-bold flex-1">{title}</h2>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${allCorrect ? "bg-[#3E5F44]" : "bg-[#F77F00]"}`}>
            {allCorrect ? <CheckCircle2 size={56} className="text-white" /> : <ShieldAlert size={56} className="text-white" />}
          </div>
          <h3 className="text-2xl font-bold text-[#0A043C] text-center">
            {allCorrect ? t("allCorrect") : t("keepPracticing")}
          </h3>
          <p className="text-gray-600 text-lg text-center">
            {score} / {scenarios.length} {t("correct")}
          </p>
          <button onClick={() => navigate(backPath)} className="w-full py-4 bg-[#D62828] text-white text-xl font-bold rounded-xl active:scale-95 shadow-lg">{t("done")}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
        <button id="tour-back-button" onClick={() => navigate(backPath)} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back"><ArrowLeft size={28} /></button>
        <h2 className="text-2xl font-bold flex-1">{title}</h2>
        <button onClick={() => speak(t(speakKey))} className="p-3 bg-white/20 rounded-full active:bg-white/30" aria-label="Read aloud"><Volume2 size={24} className="text-white" /></button>
      </div>

      <div className="px-4 py-3 bg-white border-b border-gray-200 shrink-0 flex items-center gap-2 justify-center">
        {scenarios.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-[#D62828] w-8" : i < current ? "bg-[#3E5F44]" : "bg-gray-300"}`} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {scenario.scenarioContent}
        </div>

        <div className="bg-[#F77F00]/10 border-2 border-[#F77F00]/30 rounded-xl p-4">
          <p className="text-[#0A043C] font-bold text-lg">{t(scenario.questionKey)}</p>
        </div>

        <div className="space-y-3">
          {scenario.choices.map((choice, i) => {
            const isSelected = selected === i;
            const isCorrect = choice.isCorrect;
            let bg = "bg-white border-gray-200";
            if (showResult && isSelected && isCorrect) bg = "bg-[#3E5F44]/10 border-[#3E5F44]";
            if (showResult && isSelected && !isCorrect) bg = "bg-[#D62828]/10 border-[#D62828]";
            if (showResult && !isSelected && isCorrect) bg = "bg-[#3E5F44]/5 border-[#3E5F44]/50";

            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-all active:scale-[0.98] flex items-center gap-3 ${bg}`}>
                {showResult && isSelected ? (
                  isCorrect ? <CheckCircle2 size={24} className="text-[#3E5F44] shrink-0" /> : <XCircle size={24} className="text-[#D62828] shrink-0" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 shrink-0 ${isSelected ? "border-[#03506F] bg-[#03506F]" : "border-gray-300"}`} />
                )}
                <span className="text-[#0A043C]">{t(choice.textKey)}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-700 text-base leading-relaxed">{t(scenario.explanationKey)}</p>
          </motion.div>
        )}
      </div>

      {showResult && (
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <button onClick={handleNext} className="w-full py-4 bg-[#D62828] text-white text-xl font-bold rounded-xl active:scale-[0.98] shadow-lg">
            {current < scenarios.length - 1 ? t("next") : t("done")}
          </button>
        </div>
      )}
    </div>
  );
}
