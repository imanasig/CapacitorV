import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Volume2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface StepConfig {
  titleKey: string;
  content: React.ReactNode;
  canProceed: boolean;
}

interface StepModuleProps {
  title: string;
  backPath: string;
  steps: StepConfig[];
  onComplete: () => void;
  speakKey: string;
  successTitleKey: string;
  successMsgKey: string;
  learningKeys: string[];
}

export function StepModule({
  title, backPath, steps, onComplete, speakKey,
  successTitleKey, successMsgKey, learningKeys,
}: StepModuleProps) {
  const { speak, t } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
    else { onComplete(); setComplete(true); }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else navigate(backPath);
  };

  if (complete) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-[#03506F] to-[#3E5F44] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
          <button onClick={() => navigate(backPath)} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back"><ArrowLeft size={28} /></button>
          <h2 className="text-2xl font-bold flex-1">{title}</h2>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-[#3E5F44] rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-[#0A043C] text-center">{t(successTitleKey)}</h3>
          <p className="text-gray-600 text-lg text-center">{t(successMsgKey)}</p>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 w-full">
            <h4 className="text-lg font-bold text-[#0A043C] mb-3">{t("whatYouLearned")}</h4>
            <ul className="space-y-3">
              {learningKeys.map((key, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#3E5F44] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate(backPath)} className="w-full py-4 bg-[#03506F] text-white text-xl font-bold rounded-xl active:scale-95 shadow-lg">{t("done")}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-gradient-to-r from-[#03506F] to-[#3E5F44] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
        <button onClick={handleBack} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back"><ArrowLeft size={28} /></button>
        <h2 className="text-2xl font-bold flex-1">{title}</h2>
        <button onClick={() => speak(t(speakKey))} className="p-3 bg-white/20 rounded-full active:bg-white/30" aria-label="Read aloud"><Volume2 size={24} className="text-white" /></button>
      </div>

      <div className="px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#0A043C] font-bold">{t("next")} {currentStep + 1} / {totalSteps}</span>
          <span className="text-[#03506F] font-bold">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#03506F] to-[#3E5F44] transition-all duration-500 rounded-full" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <h3 className="text-xl font-bold text-[#0A043C] mb-4">{t(step.titleKey)}</h3>
            {step.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-3">
        <button onClick={handleBack} className="flex-1 py-4 rounded-xl font-bold text-lg border-2 border-gray-300 text-gray-700 active:bg-gray-100">
          {currentStep === 0 ? t("exit") : t("back")}
        </button>
        <button onClick={handleNext} disabled={!step.canProceed} className={`flex-[2] py-4 rounded-xl font-bold text-lg transition-all ${step.canProceed ? "bg-[#03506F] text-white active:scale-[0.98] shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
          {currentStep === totalSteps - 1 ? t("confirm") : t("next")}
        </button>
      </div>
    </div>
  );
}
