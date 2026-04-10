import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import {
  ArrowLeft, Volume2, CheckCircle2, ShoppingCart, Search, Menu,
  Settings, Home, Trash2, Heart, User, Star, X, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Phase = "explore" | "quest" | "complete";

interface IconInfo {
  id: string;
  Icon: React.ElementType;
  emoji: string;
  nameKey: string;
  descKey: string;
}

const ICONS: IconInfo[] = [
  { id: "cart", Icon: ShoppingCart, emoji: "🛒", nameKey: "slIconCart", descKey: "slIconCartDesc" },
  { id: "search", Icon: Search, emoji: "🔍", nameKey: "slIconSearch", descKey: "slIconSearchDesc" },
  { id: "menu", Icon: Menu, emoji: "☰", nameKey: "slIconMenu", descKey: "slIconMenuDesc" },
  { id: "settings", Icon: Settings, emoji: "⚙️", nameKey: "slIconSettings", descKey: "slIconSettingsDesc" },
  { id: "home", Icon: Home, emoji: "🏠", nameKey: "slIconHome", descKey: "slIconHomeDesc" },
  { id: "trash", Icon: Trash2, emoji: "🗑️", nameKey: "slIconTrash", descKey: "slIconTrashDesc" },
  { id: "heart", Icon: Heart, emoji: "❤️", nameKey: "slIconHeart", descKey: "slIconHeartDesc" },
  { id: "profile", Icon: User, emoji: "👤", nameKey: "slIconProfile", descKey: "slIconProfileDesc" },
];

const QUESTS = [
  { questKey: "slQuest1", answerId: "search" },
  { questKey: "slQuest2", answerId: "cart" },
  { questKey: "slQuest3", answerId: "trash" },
  { questKey: "slQuest4", answerId: "settings" },
  { questKey: "slQuest5", answerId: "home" },
];

const PRODUCTS = [
  { name: "Wireless Earbuds", price: "₹1,299", rating: "4.3" },
  { name: "Phone Cover", price: "₹299", rating: "4.1" },
  { name: "USB Cable", price: "₹199", rating: "4.5" },
  { name: "Power Bank", price: "₹899", rating: "4.6" },
];

export function SymbolLiteracy() {
  const { t, speak, markCompleted } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("explore");
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [activeIcon, setActiveIcon] = useState<IconInfo | null>(null);
  const [questIndex, setQuestIndex] = useState(0);
  const [questFeedback, setQuestFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [shakeId, setShakeId] = useState<string | null>(null);

  const allDiscovered = discovered.size >= ICONS.length;
  const currentQuest = QUESTS[questIndex];

  const handleIconTap = (icon: IconInfo) => {
    if (phase === "explore") {
      setActiveIcon(icon);
      setDiscovered((prev) => new Set(prev).add(icon.id));
    } else if (phase === "quest") {
      if (icon.id === currentQuest.answerId) {
        setQuestFeedback("correct");
        setTimeout(() => {
          setQuestFeedback("none");
          if (questIndex < QUESTS.length - 1) {
            setQuestIndex((prev) => prev + 1);
          } else {
            markCompleted("symbolLiteracyCompleted");
            setPhase("complete");
          }
        }, 1200);
      } else {
        setQuestFeedback("wrong");
        setShakeId(icon.id);
        setTimeout(() => {
          setQuestFeedback("none");
          setShakeId(null);
        }, 800);
      }
    }
  };

  const closeExplanation = () => setActiveIcon(null);

  // Icon button helper with pulse and interaction states
  const IconButton = ({ icon, size = 24, className = "" }: { icon: IconInfo; size?: number; className?: string }) => {
    const isDiscovered = discovered.has(icon.id);
    const isQuestTarget = phase === "quest" && currentQuest?.answerId === icon.id;
    const isShaking = shakeId === icon.id;
    const showPulse = phase === "explore" && !isDiscovered;

    return (
      <motion.button
        onClick={() => handleIconTap(icon)}
        animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={isShaking ? { duration: 0.4 } : {}}
        className={`relative flex items-center justify-center rounded-xl active:scale-90 transition-transform ${className}`}
        aria-label={t(icon.nameKey)}
      >
        {showPulse && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-xl bg-[#7B2D8E]/30"
          />
        )}
        {isDiscovered && phase === "explore" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#3E5F44] rounded-full border border-white z-10" />
        )}
        <icon.Icon
          size={size}
          className={`${
            questFeedback === "correct" && isQuestTarget
              ? "text-[#3E5F44]"
              : isShaking
              ? "text-[#D62828]"
              : "text-gray-700"
          } transition-colors`}
          strokeWidth={2}
        />
      </motion.button>
    );
  };

  // ── Completion screen ──
  if (phase === "complete") {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-[#2D7D46] to-[#3E5F44] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
          <button onClick={() => navigate("/practice")} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back">
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold flex-1">{t("symbolLiteracyTitle")}</h2>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-[#3E5F44] rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-[#0A043C] text-center">{t("slSuccessTitle")}</h3>
          <p className="text-gray-600 text-lg text-center">{t("slSuccessMsg")}</p>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 w-full">
            <h4 className="text-lg font-bold text-[#0A043C] mb-3">{t("whatYouLearned")}</h4>
            <ul className="space-y-3">
              {["slLearn1", "slLearn2", "slLearn3"].map((key, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#3E5F44] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate("/practice")} className="w-full py-4 bg-[#7B2D8E] text-white text-xl font-bold rounded-xl active:scale-95 shadow-lg">
            {t("done")}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main sandbox UI ──
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B2D8E] to-[#5B21B6] text-white p-4 flex items-center gap-4 shadow-md shrink-0">
        <button onClick={() => navigate("/practice")} className="p-3 active:bg-white/20 rounded-full" aria-label="Go back">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-2xl font-bold flex-1">{t("symbolLiteracyTitle")}</h2>
        <button onClick={() => speak(t("slSpeak"))} className="p-3 bg-white/20 rounded-full active:bg-white/30" aria-label="Read aloud">
          <Volume2 size={24} className="text-white" />
        </button>
      </div>

      {/* Phase indicator */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        {phase === "explore" ? (
          <div className="flex items-center justify-between">
            <span className="text-[#0A043C] font-bold">{t("slExploreTitle")}</span>
            <span className="text-[#7B2D8E] font-bold text-sm">{discovered.size}/{ICONS.length} {t("slDiscovered")}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[#0A043C] font-bold">{t("slQuestTitle")}</span>
            <span className="text-[#7B2D8E] font-bold text-sm">{questIndex + 1}/{QUESTS.length}</span>
          </div>
        )}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2D7D46] to-[#3E5F44] rounded-full"
            animate={{
              width: phase === "explore"
                ? `${(discovered.size / ICONS.length) * 100}%`
                : `${((questIndex + (questFeedback === "correct" ? 1 : 0)) / QUESTS.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Quest banner (only in quest phase) */}
      <AnimatePresence mode="wait">
        {phase === "quest" && questFeedback !== "correct" && (
          <motion.div
            key={questIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-3 bg-[#7B2D8E]/10 border-2 border-[#7B2D8E]/30 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[#7B2D8E] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-[#7B2D8E] font-bold text-sm">{t("slFindIcon")}</p>
              <p className="text-[#0A043C] font-extrabold text-lg">{t(currentQuest.questKey)}</p>
            </div>
          </motion.div>
        )}
        {questFeedback === "correct" && (
          <motion.div
            key="correct-feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-3 bg-[#3E5F44]/10 border-2 border-[#3E5F44] rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 size={28} className="text-[#3E5F44] shrink-0" />
            <p className="text-[#3E5F44] font-bold text-lg">{t("slCorrect")}</p>
          </motion.div>
        )}
        {questFeedback === "wrong" && (
          <motion.div
            key="wrong-feedback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-3 bg-[#D62828]/10 border-2 border-[#D62828] rounded-2xl p-4 flex items-center gap-3"
          >
            <X size={28} className="text-[#D62828] shrink-0" />
            <p className="text-[#D62828] font-bold text-lg">{t("slWrong")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock App Screen */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

          {/* Mock App Header */}
          <div className="bg-[#1a73e8] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconButton
                icon={ICONS.find((i) => i.id === "menu")!}
                size={22}
                className="w-10 h-10 bg-white/20 text-white"
              />
              <span className="text-white font-bold text-lg">ShopSafe</span>
            </div>
            <div className="flex items-center gap-1">
              <IconButton
                icon={ICONS.find((i) => i.id === "search")!}
                size={22}
                className="w-10 h-10 bg-white/10"
              />
              <IconButton
                icon={ICONS.find((i) => i.id === "cart")!}
                size={22}
                className="w-10 h-10 bg-white/10"
              />
            </div>
          </div>

          {/* Mock category tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {["All", "Electronics", "Fashion", "Home"].map((cat, i) => (
              <div
                key={cat}
                className={`flex-1 text-center py-2.5 text-sm font-bold ${
                  i === 0 ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" : "text-gray-500"
                }`}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3 p-3">
            {PRODUCTS.map((product, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-24 flex items-center justify-center">
                  <span className="text-3xl">{["📱", "📦", "🔌", "🔋"][i]}</span>
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-bold text-[#0A043C] truncate">{product.name}</p>
                  <p className="text-[#1a73e8] font-extrabold text-base">{product.price}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-[#F77F00] fill-[#F77F00]" />
                      <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
                    </div>
                    <IconButton
                      icon={ICONS.find((ic) => ic.id === "heart")!}
                      size={16}
                      className="w-7 h-7"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Deleted Row (shows Trash icon) */}
          <div className="mx-3 mb-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📧</span>
              <div>
                <p className="text-sm font-bold text-gray-700">Old notification</p>
                <p className="text-xs text-gray-400">Tap trash to remove</p>
              </div>
            </div>
            <IconButton
              icon={ICONS.find((ic) => ic.id === "trash")!}
              size={20}
              className="w-10 h-10 bg-red-100/60"
            />
          </div>

          {/* Mock Bottom Navigation */}
          <div className="border-t-2 border-gray-200 bg-white flex justify-around items-center py-2.5">
            {(["home", "search", "cart", "profile", "settings"] as const).map((id) => {
              const icon = ICONS.find((i) => i.id === id)!;
              return (
                <div key={id} className="flex flex-col items-center gap-0.5">
                  <IconButton icon={icon} size={22} className="w-11 h-11" />
                  <span className="text-[10px] font-bold text-gray-500">{t(icon.nameKey)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Quiz button (explore phase, all discovered) */}
        {phase === "explore" && allDiscovered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <button
              onClick={() => setPhase("quest")}
              className="w-full py-4 bg-[#7B2D8E] text-white text-xl font-bold rounded-xl active:scale-95 shadow-lg flex items-center justify-center gap-3"
            >
              {t("slStartQuiz")}
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}

        {/* Tip box for explore */}
        {phase === "explore" && !allDiscovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#7B2D8E]/10 border-2 border-[#7B2D8E]/20 rounded-2xl p-4 flex items-start gap-3 mt-4">
            <span className="text-2xl shrink-0">💡</span>
            <p className="text-[#0A043C] text-base font-medium">
              {t("slExploreTitle")}
            </p>
          </motion.div>
        )}
      </div>

      {/* Explanation Overlay (slide up) */}
      <AnimatePresence>
        {activeIcon && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeExplanation}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl z-50 shadow-2xl"
            >
              <div className="p-6">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />

                <div className="flex items-center gap-4 mb-4">
                  {/* Emoji side */}
                  <div className="w-16 h-16 bg-[#7B2D8E]/10 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    {activeIcon.emoji}
                  </div>
                  {/* Separator arrow */}
                  <div className="text-gray-300 font-bold text-xl">=</div>
                  {/* Lucide icon side */}
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                    <activeIcon.Icon size={32} className="text-[#0A043C]" />
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-extrabold text-[#0A043C] leading-tight">{t(activeIcon.nameKey)}</h3>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-5">
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">{t(activeIcon.descKey)}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => speak(`${t(activeIcon.nameKey)}. ${t(activeIcon.descKey)}`)}
                    className="flex-1 py-4 bg-[#7B2D8E] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    <Volume2 size={22} /> {t("read")}
                  </button>
                  <button
                    onClick={closeExplanation}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg active:scale-95 border border-gray-200"
                  >
                    {t("done")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
