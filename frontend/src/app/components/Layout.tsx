import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, ShieldAlert, ShieldCheck, BarChart, Languages, X, AArrowUp, Megaphone, Phone } from "lucide-react";
import { useApp, type FontSize } from "../context/AppContext";
import { LANGUAGES, type LanguageCode } from "../i18n/translations";
import { motion, AnimatePresence } from "motion/react";
import { Walkthrough } from "./Walkthrough";
import { WalkthroughProvider } from "../context/WalkthroughContext";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, fontSize, setFontSize, t } = useApp();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const fontOptions: { key: FontSize; labelKey: string; preview: string }[] = [
    { key: "small", labelKey: "fontSmall", preview: "Aa" },
    { key: "medium", labelKey: "fontMedium", preview: "Aa" },
    { key: "large", labelKey: "fontLarge", preview: "Aa" },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const navItems = [
    { path: "/", icon: Home, label: t("home") },
    { path: "/practice", icon: BookOpen, label: t("practice") },
    { path: "/safety", icon: ShieldAlert, label: t("safety") },
    { path: "/progress", icon: BarChart, label: t("progress") },
    { path: "/community-siren", icon: Megaphone, label: t("siren") },
  ];

  return (
    <WalkthroughProvider>
    <div id="mobile-container" className="flex flex-col bg-[#FFFFFF] text-[#0A043C] font-sans overflow-hidden mx-auto shadow-2xl relative" style={{ width: '74.7mm', maxWidth: '100vw', height: '161.7mm', maxHeight: '100vh' }}>
      <Walkthrough />
      {/* Top App Bar */}
      <header className="bg-[#0A043C] text-white p-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#03506F] rounded-full flex items-center justify-center border-2 border-[#3E5F44]">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold leading-tight">{t("appTitle")}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFontPicker(true)}
            className="bg-[#122D42] p-2 rounded-full border border-white/20 active:bg-[#03506F] min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#F77F00]"
            aria-label="Change font size"
          >
            <AArrowUp size={20} />
          </button>
          <button
            onClick={() => setShowLangPicker(true)}
            className="bg-[#122D42] px-3 py-2 rounded-full border border-white/20 active:bg-[#03506F] min-h-[44px] flex items-center gap-1.5 focus:outline-none focus:ring-4 focus:ring-[#F77F00]"
            aria-label={t("selectLanguage")}
          >
            <Languages size={20} />
            <span className="font-bold text-sm">{currentLang?.native ?? "EN"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t-2 border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] absolute bottom-0 w-full z-10 pb-safe" aria-label="Main navigation">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
              || (item.path !== "/" && location.pathname.startsWith(item.path))
              || (item.path === "/safety" && (location.pathname === "/detect" || location.pathname === "/chat"));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none focus:bg-gray-100 ${
                  isActive ? "text-[#03506F]" : "text-gray-500"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <div className={`p-1.5 rounded-2xl ${isActive ? "bg-[#03506F]/10" : ""}`}>
                  <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Font Size Picker Sheet */}
      <AnimatePresence>
        {showFontPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={() => setShowFontPicker(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 pb-safe"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#0A043C]">{t("fontSize")}</h2>
                  <button onClick={() => setShowFontPicker(false)} className="p-2 rounded-full bg-gray-100 active:bg-gray-200" aria-label="Close">
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex gap-3">
                  {fontOptions.map((opt) => {
                    const isSelected = fontSize === opt.key;
                    const previewSize = opt.key === "small" ? "text-sm" : opt.key === "medium" ? "text-lg" : "text-2xl";
                    return (
                      <button
                        key={opt.key}
                        onClick={() => { setFontSize(opt.key); setShowFontPicker(false); }}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          isSelected ? "border-[#03506F] bg-[#03506F]/5" : "border-gray-200 bg-white"
                        }`}
                      >
                        <span className={`font-bold text-[#0A043C] ${previewSize}`}>{opt.preview}</span>
                        <span className={`text-sm font-medium ${isSelected ? "text-[#03506F]" : "text-gray-500"}`}>
                          {t(opt.labelKey)}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#03506F] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Language Picker Sheet */}
      <AnimatePresence>
        {showLangPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={() => setShowLangPicker(false)}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto pb-safe"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#0A043C]">{t("selectLanguage")}</h2>
                  <button
                    onClick={() => setShowLangPicker(false)}
                    className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
                    aria-label="Close"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                <div className="space-y-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as LanguageCode);
                          setShowLangPicker(false);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                          isSelected
                            ? "border-[#03506F] bg-[#03506F]/5"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-[#0A043C]">{lang.native}</span>
                          <span className="text-gray-500 text-base">{lang.label}</span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#03506F] flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </WalkthroughProvider>
  );
}
