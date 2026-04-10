import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Volume2, ArrowLeft, Check, X, Heart, MessageCircle, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type VideoData = {
  id: number;
  src: string;
  isAI: boolean;
  username: string;
  caption: string;
  en: {
    correctMsg: string;
    correctLine: string;
    wrongMsg: string;
    wrongLine: string;
  };
  hi: {
    correctMsg: string;
    correctLine: string;
    wrongMsg: string;
    wrongLine: string;
  };
};

const videos: VideoData[] = [
  {
    id: 1,
    src: "/assets/videos/1.mp4",
    isAI: true,
    username: "@daily_news",
    caption: "Breaking news today 🔥",
    en: {
      correctMsg: "Nice catch! 👏 This video is computer-made.",
      correctLine: "AI can fake videos so well now — always double-check.",
      wrongMsg: "Not quite — this video is actually computer-made.",
      wrongLine: "These fake videos look real enough to fool anyone.",
    },
    hi: {
      correctMsg: "बहुत अच्छा! 👏 यह वीडियो कंप्यूटर से बनाया गया है।",
      correctLine: "AI इतने अच्छे नकली वीडियो बना सकते हैं — हमेशा जांचें।",
      wrongMsg: "ठीक नहीं है — यह वीडियो कंप्यूटर से बनाया गया है।",
      wrongLine: "ये नकली वीडियो असली लगते हैं और किसी को भी धोखा दे सकते हैं।",
    },
  },
  {
    id: 2,
    src: "/assets/videos/2.mp4",
    isAI: true,
    username: "@tech_guru",
    caption: "Check this out! Amazing discovery",
    en: {
      correctMsg: "Awesome! 🎯 This is a fake video.",
      correctLine: "Watch for strange movements and unnatural blinking — big red flags.",
      wrongMsg: "Oops! This video is actually fake.",
      wrongLine: "Look closely at the eyes and mouth — computers often mess these up.",
    },
    hi: {
      correctMsg: "शानदार! 🎯 यह नकली वीडियो है।",
      correctLine: "अजीब गतिविधियां और अप्राकृतिक पलक झपकना देखें — ये बड़े संकेत हैं।",
      wrongMsg: "आओ! यह वीडियो असल में नकली है।",
      wrongLine: "आंखों और मुंह को करीब से देखें — कंप्यूटर अक्सर ये गलत बनाते हैं।",
    },
  },
  {
    id: 3,
    src: "/assets/videos/3.mp4",
    isAI: true,
    username: "@viral_central",
    caption: "This went viral! 🚀",
    en: {
      correctMsg: "Exactly! ✨ This is a deepfake — a computer-made video.",
      correctLine: "Deepfakes are getting scary good. Always verify before you share.",
      wrongMsg: "Not this time — this video is fake.",
      wrongLine: "Check who posted it and when. Fake videos often come from unknown accounts.",
    },
    hi: {
      correctMsg: "बिल्कुल! ✨ यह डीपफेक है — कंप्यूटर से बनाया गया वीडियो।",
      correctLine: "डीपफेक अब बहुत अच्छे हो गए हैं। साझा करने से पहले हमेशा जांचें।",
      wrongMsg: "इस बार नहीं — यह वीडियो नकली है।",
      wrongLine: "जांचें कि किसने भेजा और कब। नकली वीडियो अक्सर अनजान खातों से आते हैं।",
    },
  },
  {
    id: 4,
    src: "/assets/videos/4.mp4",
    isAI: true,
    username: "@media_watch",
    caption: "Stay alert online 🛡️",
    en: {
      correctMsg: "Perfect! 🏆 You spotted the fake!",
      correctLine: "You're learning! Keep questioning what you see online.",
      wrongMsg: "Close call! This one is actually fake.",
      wrongLine: "Fake videos can spread fast. Don't share before checking the source.",
    },
    hi: {
      correctMsg: "बिल्कुल सही! 🏆 आपने नकली को पकड़ा!",
      correctLine: "आप सीख रहे हैं! ऑनलाइन जो देखें उस पर सवाल उठाते रहें।",
      wrongMsg: "करीब था! यह असल में नकली है।",
      wrongLine: "नकली वीडियो जल्दी फैलते हैं। साझा करने से पहले स्रोत जांचें।",
    },
  },
];

type AnswerState = "none" | "correct" | "incorrect";

export function DetectDeepfakes() {
  const { language, speak, markCompleted } = useApp();
  const navigate = useNavigate();
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideo = videos[currentVideoIdx];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Handle wheel scroll to move between videos with throttling
    let wheelTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      if (isScrollLocked || wheelTimeout) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0 && currentVideoIdx < videos.length - 1) {
        e.preventDefault();
        wheelTimeout = setTimeout(() => {
          clearTimeout(wheelTimeout);
          wheelTimeout = undefined as any;
        }, 300);
        goToNextVideo();
      } else if (e.deltaY < 0 && currentVideoIdx > 0) {
        e.preventDefault();
        wheelTimeout = setTimeout(() => {
          clearTimeout(wheelTimeout);
          wheelTimeout = undefined as any;
        }, 300);
        goToPrevVideo();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
        if (wheelTimeout) clearTimeout(wheelTimeout);
      };
    }
  }, [currentVideoIdx, isScrollLocked]);

  useEffect(() => {
    setVideoLoaded(true);
    setLiked(false);
    setShowQuestion(false);
    // Show question after 2 seconds so user can watch video first
    const timer = setTimeout(() => setShowQuestion(true), 2000);
    return () => clearTimeout(timer);
  }, [currentVideoIdx]);

  useEffect(() => {
    const video = videoRefs.current[currentVideoIdx];
    if (!video) return;

    // Ensure video is ready before playing
    if (answerState === "none") {
      video.currentTime = 0;
      // Use a small delay to ensure browser allows playback
      setTimeout(() => {
        video.play().catch((err) => {
          console.log("Autoplay prevented, wait for user interaction");
        });
      }, 100);
    } else {
      video.pause();
    }

    // Cleanup: pause all other videos
    videoRefs.current.forEach((v, idx) => {
      if (idx !== currentVideoIdx && v) {
        v.pause();
      }
    });
  }, [currentVideoIdx, answerState]);

  const handleAnswer = (userAnswerIsAI: boolean) => {
    if (userAnswerIsAI === currentVideo.isAI) {
      setAnswerState("correct");
      speak(language === "en" ? "You got it right!" : "आप सही हैं!");
    } else {
      setAnswerState("incorrect");
      speak(language === "en" ? "Not quite right" : "बिल्कुल सही नहीं");
    }
    setIsScrollLocked(true);
  };

  const goToNextVideo = () => {
    if (currentVideoIdx < videos.length - 1) {
      setCurrentVideoIdx(currentVideoIdx + 1);
      setAnswerState("none");
      setIsScrollLocked(false);
    } else {
      markCompleted("deepfakesCompleted");
      navigate("/safety");
    }
  };

  const goToPrevVideo = () => {
    if (currentVideoIdx > 0) {
      setCurrentVideoIdx(currentVideoIdx - 1);
      setAnswerState("none");
      setIsScrollLocked(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full bg-black flex flex-col"
    >
      {/* Back Button & Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/safety")}
          className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Mark complete"
        >
          <Check size={24} className="text-white" />
        </motion.button>
      </div>

      {/* Video Section - with flex layout */}
      <div className="flex-1 relative w-full overflow-hidden">
        {/* Videos */}
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === currentVideoIdx ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {/* Loading Spinner */}
            {!videoLoaded && idx === currentVideoIdx && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Video - Full Screen */}
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              src={video.src}
              className="w-full h-full object-cover"
              loop
              playsInline
              preload="metadata"
              onLoadedMetadata={() => {
                if (idx === currentVideoIdx) setVideoLoaded(true);
              }}
              onCanPlay={() => {
                if (idx === currentVideoIdx) setVideoLoaded(true);
              }}
              onError={(e) => {
                console.error("Video error:", e);
              }}
            />

            {/* Enhanced Gradient Overlay - Top to Bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

            {/* Instagram-like Bottom Left Profile Section */}
            {!answerState && videoLoaded && (
              <div className="absolute bottom-40 left-4 z-20">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <p className="text-white font-bold text-sm">{video.username}</p>
                  <p className="text-white text-xs line-clamp-2 text-white/80 mt-0.5">
                    {video.caption}
                  </p>
                </div>
              </div>
            )}

            {/* Right Side Action Icons - Instagram Style with Glow */}
            {!answerState && videoLoaded && (
              <div className="absolute bottom-48 right-4 z-20 flex flex-col gap-6">
                {/* Like Button */}
                <button
                  onClick={() => setLiked(!liked)}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform group"
                  aria-label="Like"
                >
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 group-hover:bg-black/60 transition-colors">
                    <Heart
                      size={24}
                      className={liked ? "fill-red-500 text-red-500" : "text-white"}
                    />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {liked ? "♥" : "❤"}
                  </span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform group">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 group-hover:bg-black/60 transition-colors">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">💬</span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform group">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 group-hover:bg-black/60 transition-colors">
                    <Share2 size={24} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">📤</span>
                </button>
              </div>
            )}

            {/* Progress Counter - Top Right with Premium Look */}
            <div className="absolute top-20 right-4 z-30 px-4 py-2 rounded-full font-bold text-white text-sm shadow-lg bg-gradient-to-r from-orange-500/60 to-red-600/60 backdrop-blur-md border border-white/20">
              {currentVideoIdx + 1}/{videos.length}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Question Section - Appears BELOW Video */}
      {answerState === "none" && showQuestion && (
        <div className="bg-gradient-to-t from-black via-black to-black/80 px-4 py-6 rounded-t-2xl">
          {/* Question Text - Large & Clear */}
          <h2 className="text-white text-2xl font-bold text-center mb-6">
            {language === "en"
              ? "AI generated?"
              : "AI द्वारा बनाया गया?"}
          </h2>

          {/* Answer Buttons - Big & Colorful with Gradient */}
          <div className="flex gap-3 max-w-md mx-auto mb-4">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform hover:shadow-xl"
            >
              {language === "en" ? "No" : "नहीं"}
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-gradient-to-br from-red-500 to-red-700 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform hover:shadow-xl"
            >
              {language === "en" ? "Yes" : "हां"}
            </button>
          </div>
        </div>
      )}

      {/* Result Sheet - Overlay Modal (appears ABOVE everything) */}
      {answerState !== "none" && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div className="w-full bg-gradient-to-b from-black/95 to-black rounded-t-3xl p-6 max-h-[65vh] overflow-y-auto">
            {/* Result Message */}
            <div className="text-center mb-6">
              <h2
                className={`text-3xl font-bold ${
                  answerState === "correct" ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {answerState === "correct"
                  ? language === "en"
                    ? currentVideo.en.correctMsg
                    : currentVideo.hi.correctMsg
                  : language === "en"
                  ? currentVideo.en.wrongMsg
                  : currentVideo.hi.wrongMsg}
              </h2>
            </div>

            {/* Educational Message */}
            <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
              <p className="text-white text-center leading-relaxed">
                {answerState === "correct"
                  ? language === "en"
                    ? currentVideo.en.correctLine
                    : currentVideo.hi.correctLine
                  : language === "en"
                  ? currentVideo.en.wrongLine
                  : currentVideo.hi.wrongLine}
              </p>
            </div>

            {/* Verified Account Tip */}
            <div className="bg-blue-600/20 rounded-2xl p-4 mb-6 border border-blue-500/40">
              <p className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>✓</span>
                {language === "en"
                  ? "How to Spot Real Videos:"
                  : "असली वीडियो पहचानें:"}
              </p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>✓ {language === "en" ? "Blue checkmark = Verified account (usually real)" : "नीली जांच = सत्यापित खाता (आमतौर पर असली)"}</li>
                <li>✓ {language === "en" ? "Check posting history" : "पोस्टिंग इतिहास देखें"}</li>
                <li>✓ {language === "en" ? "Look for natural movements" : "प्राकृतिक गतिविधियां देखें"}</li>
              </ul>
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextVideo}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {currentVideoIdx === videos.length - 1
                ? language === "en"
                  ? "✓ Complete! 🎓"
                  : "✓ पूरा! 🎓"
                : language === "en"
                ? `Next (${currentVideoIdx + 2}/4) →`
                : `अगला (${currentVideoIdx + 2}/4) →`}
            </button>

            {/* Completion Message */}
            {currentVideoIdx === videos.length - 1 && answerState !== "none" && (
              <div className="mt-4 p-4 bg-green-600/20 border border-green-500/40 rounded-2xl text-center">
                <p className="text-green-300 font-semibold">
                  {language === "en"
                    ? "🏆 You're now a Deepfake Detective!"
                    : "🏆 आप अब नकली पहचान विशेषज्ञ हैं!"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
