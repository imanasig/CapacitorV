import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { translations, LANGUAGES, type LanguageCode } from "../i18n/translations";

export type FontSize = "small" | "medium" | "large";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "10px",
  medium: "12px",
  large: "14px",
};

type ProgressState = {
  upiCompleted: boolean;
  sendMoneyCompleted: boolean;
  qrPayCompleted: boolean;
  passwordCompleted: boolean;
  installAppCompleted: boolean;
  orderBlinkitCompleted: boolean;
  symbolLiteracyCompleted: boolean;
  smsCompleted: boolean;
  chatCompleted: boolean;
  deepfakesCompleted: boolean;
  otpScamCompleted: boolean;
  fakeLinkCompleted: boolean;
  fakeAppCompleted: boolean;
  socialEngCompleted: boolean;
  aadhaarCompleted: boolean;
};

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  speak: (text: string) => void;
  progress: ProgressState;
  markCompleted: (module: keyof ProgressState) => void;
  t: (key: string) => string;
  userUuid: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const { t: i18nT, i18n } = useTranslation();

  // Apply language to i18next whenever it changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Apply font size to html root whenever it changes
  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", FONT_SIZE_MAP[fontSize]);
  }, [fontSize]);

  const [progress, setProgress] = useState<ProgressState>({
    upiCompleted: false,
    sendMoneyCompleted: false,
    qrPayCompleted: false,
    passwordCompleted: false,
    installAppCompleted: false,
    orderBlinkitCompleted: localStorage.getItem("orderBlinkitCompleted") === "true",
    symbolLiteracyCompleted: localStorage.getItem("symbolLiteracyCompleted") === "true",
    smsCompleted: false,
    chatCompleted: false,
    deepfakesCompleted: false,
    otpScamCompleted: false,
    fakeLinkCompleted: false,
    fakeAppCompleted: false,
    socialEngCompleted: false,
    aadhaarCompleted: false,
  });

  const [userUuid, setUserUuid] = useState<string>("");

  useEffect(() => {
    let uuid = localStorage.getItem("safely_user_uuid");
    if (!uuid) {
      uuid = crypto.randomUUID ? crypto.randomUUID() : "anon-" + Date.now();
      localStorage.setItem("safely_user_uuid", uuid);
    }
    setUserUuid(uuid);

    // Fetch user progress from backend
    fetch(`http://127.0.0.1:8000/api/progress/${uuid}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.detail) {
          setProgress(prev => ({
            ...prev,
            upiCompleted: data.upi_completed ?? false,
            sendMoneyCompleted: data.send_money_completed ?? false,
            qrPayCompleted: data.qr_pay_completed ?? false,
            passwordCompleted: data.password_completed ?? false,
            installAppCompleted: data.install_app_completed ?? false,
            smsCompleted: data.sms_completed ?? false,
            chatCompleted: data.chat_completed ?? false,
            otpScamCompleted: data.otp_scam_completed ?? false,
            fakeLinkCompleted: data.fake_link_completed ?? false,
            fakeAppCompleted: data.fake_app_completed ?? false,
            socialEngCompleted: data.social_eng_completed ?? false,
            aadhaarCompleted: data.aadhaar_completed ?? false,
          }));
        }
      })
      .catch(err => console.error("Failed to load backend progress:", err));
  }, []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const langInfo = LANGUAGES.find((l) => l.code === language);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langInfo?.speechLang ?? "en-IN";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const markCompleted = useCallback((module: keyof ProgressState) => {
    setProgress((prev) => {
      if (prev[module]) return prev; // Avoid redundant updates
      return { ...prev, [module]: true };
    });

    // Frontend-only modules: save to localStorage, skip backend
    if (module === "symbolLiteracyCompleted" || module === "orderBlinkitCompleted") {
      localStorage.setItem(module, "true");
    } else if (userUuid) {
      // Optimistic UI update already happened above, now silently sync with backend
      fetch(`http://127.0.0.1:8000/api/progress/${userUuid}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleName: module })
      }).catch(err => console.error("Failed to sync progress:", err));
    }
  }, [userUuid]);

  const t = useCallback((key: string) => {
    return i18nT(key) as string;
  }, [i18nT]);

  return (
    <AppContext.Provider value={{ language, setLanguage, fontSize, setFontSize, speak, progress, markCompleted, t, userUuid }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
