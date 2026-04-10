import { createContext, useContext, useState, ReactNode } from 'react';

interface Module {
  id: string;
  title: string;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  earned: boolean;
}

interface ProgressContextType {
  modules: Module[];
  badges: Badge[];
  completeModule: (moduleId: string) => void;
  earnBadge: (badgeId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>([
    { id: 'upi-pin', title: 'Set UPI PIN', completed: false },
    { id: 'red-flag', title: 'Red Flag Detector', completed: false },
    { id: 'scam-simulator', title: 'AI Scam Simulator', completed: false },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: 'safe-user', name: 'Safe User', earned: false },
    { id: 'scam-detector', name: 'Scam Detector', earned: false },
    { id: 'pin-expert', name: 'PIN Expert', earned: false },
  ]);

  const completeModule = (moduleId: string) => {
    setModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, completed: true } : m))
    );
  };

  const earnBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, earned: true } : b))
    );
  };

  return (
    <ProgressContext.Provider value={{ modules, badges, completeModule, earnBadge }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
