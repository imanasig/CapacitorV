import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

export interface WalkthroughStep {
  id: string;
  targetId: string;
  titleKey: string;
  descKey: string;
  expectedPath?: string;     
  autoNextOnPath?: string;   
}

interface WalkthroughContextType {
  isActive: boolean;
  currentStep: number;
  steps: WalkthroughStep[];
  startWalkthrough: () => void;
  nextStep: () => void;
  skipWalkthrough: () => void;
  currentStepData: WalkthroughStep | null;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

const STEPS: WalkthroughStep[] = [
  {
    id: "home-emergency",
    targetId: "tour-emergency",
    titleKey: "tourEmergencyTitle",
    descKey: "tourEmergencyDesc",
    expectedPath: "/",
    autoNextOnPath: "/emergency-contacts",
  },
  {
    id: "emergency-back",
    targetId: "tour-back-button",
    titleKey: "tourBackTitle",
    descKey: "tourBackDesc",
    expectedPath: "/emergency-contacts",
    autoNextOnPath: "/",
  },
  {
    id: "home-practice",
    targetId: "tour-practice",
    titleKey: "tourPracticeTitle",
    descKey: "tourPracticeDesc",
    expectedPath: "/",
    autoNextOnPath: "/practice",
  },
  {
    id: "practice-hub-item",
    targetId: "tour-practice-item-0",
    titleKey: "tourTrySkillTitle",
    descKey: "tourTrySkillDesc",
    expectedPath: "/practice",
    autoNextOnPath: "/practice/upi-pin",
  },
  {
    id: "practice-session-back",
    targetId: "tour-back-button",
    titleKey: "tourReturnTitle",
    descKey: "tourReturnDesc",
    expectedPath: "/practice/upi-pin",
    autoNextOnPath: "/practice",
  },
  {
    id: "practice-hub-to-home",
    targetId: "tour-home",
    titleKey: "tourHomeTitle",
    descKey: "tourHomeDesc",
    expectedPath: "/practice",
    autoNextOnPath: "/",
  },
  {
    id: "home-safety",
    targetId: "tour-safety",
    titleKey: "tourSafetyTitle",
    descKey: "tourSafetyDesc",
    expectedPath: "/",
    autoNextOnPath: "/safety",
  },
  {
    id: "safety-hub-item",
    targetId: "tour-safety-item-0",
    titleKey: "tourDetectTitle",
    descKey: "tourDetectDesc",
    expectedPath: "/safety",
    autoNextOnPath: "/detect",
  },
  {
    id: "detect-back",
    targetId: "tour-back-button",
    titleKey: "tourReturnTitle",
    descKey: "tourDetectBackDesc",
    expectedPath: "/detect",
    autoNextOnPath: "/safety",
  },
  {
    id: "safety-hub-to-progress",
    targetId: "tour-progress",
    titleKey: "tourProgressTitle",
    descKey: "tourProgressDesc",
    expectedPath: "/safety",
    autoNextOnPath: "/progress",
  },
  {
    id: "progress-screen",
    targetId: "tour-progress-summary",
    titleKey: "tourAchievementsTitle",
    descKey: "tourAchievementsDesc",
    expectedPath: "/progress",
  },
  {
    id: "progress-to-home",
    targetId: "tour-home",
    titleKey: "tourHomeTitle",
    descKey: "tourProgressHomeDesc",
    expectedPath: "/progress",
    autoNextOnPath: "/",
  },
  {
    id: "nav-siren",
    targetId: "tour-community-siren",
    titleKey: "tourSirenTitle",
    descKey: "tourSirenDesc",
    expectedPath: "/",
    autoNextOnPath: "/community-siren",
  },
  {
    id: "siren-alerts-tab",
    targetId: "tour-siren-alerts-tab",
    titleKey: "tourSirenAlertsTitle",
    descKey: "tourSirenAlertsDesc",
    expectedPath: "/community-siren",
  },
  {
    id: "siren-alerts-content",
    targetId: "tour-siren-first-simulation",
    titleKey: "tourSirenContentTitle",
    descKey: "tourSirenContentDesc",
    expectedPath: "/community-siren",
  },
  {
    id: "siren-finish",
    targetId: "tour-home",
    titleKey: "tourSirenFinishTitle",
    descKey: "tourSirenFinishDesc",
    expectedPath: "/community-siren",
    autoNextOnPath: "/",
  },
];

const STORAGE_KEY = "SafeLy_User_Walkthrough_Complete_V1_Final";

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay to ensure everything is mounted
      setTimeout(() => setIsActive(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const step = STEPS[currentStep];
    if (step && step.autoNextOnPath === location.pathname) {
      setTimeout(() => {
        if (currentStep + 1 < STEPS.length) {
          setCurrentStep(currentStep + 1);
        } else {
          endWalkthrough();
        }
      }, 500);
    }
  }, [location.pathname, isActive, currentStep]);

  const currentStepData = isActive && currentStep < STEPS.length ? STEPS[currentStep] : null;

  const startWalkthrough = () => {
    setCurrentStep(0);
    setIsActive(true);
    navigate("/");
  };

  const nextStep = () => {
    if (currentStep + 1 < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      endWalkthrough();
    }
  };

  const skipWalkthrough = () => {
    endWalkthrough();
  };

  const endWalkthrough = () => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        currentStep,
        steps: STEPS,
        startWalkthrough,
        nextStep,
        skipWalkthrough,
        currentStepData,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error("useWalkthrough must be used within WalkthroughProvider");
  return ctx;
}
