import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StepModule } from "../../components/StepModule";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Download,
  Share2,
  Zap,
} from "lucide-react";

// ─── Single source of truth ───────────────────────────────────────────────────
const DEFAULT_AADHAAR = "4444 3333 6666 8888";
const DUMMY_OTP = "732914";

// ─── Shared sub-components (defined ONCE, used in both card instances) ────────

const AshokaEmblem = () => (
  <img
    src="/1.png"
    alt="Ashoka Emblem"
    style={{ width: 34, height: 34, objectFit: "contain", display: "block" }}
  />
);

const FingerprintSVG = () => (
  <svg width="24" height="16" viewBox="0 0 24 16">
    <path d="M12 2 C7 2 3 6 3 10"   stroke="#FF9933" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 4 C8 4 5 7 5 10"   stroke="#138808" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 6 C9 6 7 8 7 10"   stroke="#003580" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 2 C17 2 21 6 21 10" stroke="#FF9933" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 4 C16 4 19 7 19 10" stroke="#138808" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 6 C15 6 17 8 17 10" stroke="#003580" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const PersonSilhouette = () => (
  <svg viewBox="0 0 80 95" width="60" height="70" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="95" fill="#D0D0D0" />
    <circle cx="40" cy="32" r="18" fill="#9E9E9E" />
    <ellipse cx="40" cy="85" rx="26" ry="18" fill="#9E9E9E" />
  </svg>
);

const QRImage = () => (
  <img
    src="/2.png"
    alt="QR Code"
    style={{ width: 60, height: 60, objectFit: "contain", display: "block" }}
  />
);

// ─── Single unified Aadhaar card component ────────────────────────────────────
interface AadhaarCardProps {
  masked: boolean;
  aadhaarNumber?: string; // always pass enteredAadhaar from parent
}

function AadhaarCard({ masked, aadhaarNumber = DEFAULT_AADHAAR }: AadhaarCardProps) {
  const clean = aadhaarNumber.replace(/\s/g, "");
  const last4 = clean.slice(-4) || "8888";
  const displayNumber = masked ? `XXXX  XXXX  XXXX  ${last4}` : aadhaarNumber;

  return (
    <div
      style={{
        width: "360px",
        background: "#FFFFFF",
        border: "1.5px solid #BBBBBB",
        borderRadius: "10px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      {/* ── Tricolor left stripe ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "7px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
        }}
      >
        <div style={{ flex: 1, background: "#FF9933" }} />
        <div style={{ flex: 1, background: "#FFFFFF", borderLeft: "1px solid #DDD", borderRight: "1px solid #DDD" }} />
        <div style={{ flex: 1, background: "#138808" }} />
      </div>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px 8px 18px",
          borderBottom: "1px solid #E8E8E8",
          background: "#FFFFFF",
          position: "relative",
        }}
      >
        {/* Left: Ashoka Emblem (real image) */}
        <div style={{ flexShrink: 0 }}>
          <AshokaEmblem />
        </div>

        {/* Center: Government text — absolutely centered */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          <div style={{ fontSize: "10px", color: "#FF6600", fontWeight: 700 }}>भारत सरकार</div>
          <div style={{ fontSize: "10px", color: "#1A1A2E", fontWeight: 800, letterSpacing: "0.8px" }}>
            GOVERNMENT OF INDIA
          </div>
        </div>

        {/* Right: Aadhaar branding */}
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div style={{ fontSize: "15px", color: "#CC0000", fontWeight: 800, lineHeight: 1.1 }}>आधार</div>
          <div style={{ fontSize: "7px", color: "#666", letterSpacing: "0.3px" }}>Unique ID</div>
          <div style={{ marginTop: "3px" }}>
            <FingerprintSVG />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          padding: "8px 10px 8px 16px",
          alignItems: "center",
          background: "#FFFFFF",
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: "54px",
            height: "65px",
            background: "#D0D0D0",
            border: "1.5px solid #AAAAAA",
            borderRadius: "2px",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <PersonSilhouette />
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px", paddingTop: "4px" }}>
          <div style={{ fontSize: "10.5px", color: "#1A1A1A", lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>NAME :</span>{" "}
            {masked ? "XXXX" : "JOHN DEE"}
          </div>
          <div style={{ fontSize: "10.5px", color: "#1A1A1A", lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>DOB :</span> 15/03/1990
          </div>
          <div style={{ fontSize: "10.5px", color: "#1A1A1A", lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>GENDER :</span> Male
          </div>
        </div>

        {/* QR Code (real image) */}
        <div style={{ flexShrink: 0, marginRight: "4px" }}>
          <QRImage />
        </div>
      </div>

      {/* ── Aadhaar Number ── */}
      <div style={{ borderTop: "1.5px solid #DDDDDD", padding: "6px 16px", background: "#FFFFFF" }}>
        <div
          style={{
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "6px",
            color: "#111111",
            fontFamily: "'Courier New', monospace",
            textAlign: "left",
          }}
        >
          {displayNumber}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: "#FF9933", padding: "6px 0", textAlign: "center" }}>
        <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#CC0000", letterSpacing: "0.4px" }}>
          आधार - भारतीय विशिष्ट पहचान प्राधिकरण
        </div>
      </div>

      {/* ── MASKED stamp overlay ── */}
      {masked && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-20deg)",
            border: "3px solid #138808",
            color: "#138808",
            fontSize: "22px",
            fontWeight: 900,
            padding: "3px 10px",
            opacity: 0.3,
            pointerEvents: "none",
            letterSpacing: "3px",
          }}
        >
          MASKED
        </div>
      )}
    </div>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────
export function AadhaarModule() {
  const { t, markCompleted } = useApp();

  // enteredAadhaar drives BOTH cards and the masked last-4
  const [enteredAadhaar, setEnteredAadhaar] = useState(DEFAULT_AADHAAR);
  const [captchaInput, setCaptchaInput]     = useState("");
  const [otpInput, setOtpInput]             = useState("");
  const [eAadhaarGenerated, setEAadhaarGenerated] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [points, setPoints]   = useState(0);
  const [badges, setBadges]   = useState<string[]>([]);

  // Derived values — always in sync with enteredAadhaar
  const cleanAadhaar  = enteredAadhaar.replace(/\s/g, "");
  const isValidLength = cleanAadhaar.length >= 12;

  const [captchaCode] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  });

  const validateCaptcha = () => captchaInput.toUpperCase() === captchaCode;
  const validateOTP     = () => otpInput === DUMMY_OTP;

  const addBadge = (id: string) =>
    setBadges((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const handleProceed = () => {
    if (simulationStep === 0 && isValidLength) {
      setSimulationStep(1);
      setPoints((p) => p + 50);
      addBadge("start-quest");
    } else if (simulationStep === 1 && validateCaptcha()) {
      setSimulationStep(2);
      setPoints((p) => p + 50);
    } else if (simulationStep === 2 && validateOTP()) {
      setEAadhaarGenerated(true);
      setSimulationStep(3);
      setPoints((p) => p + 100);
      addBadge("security-master");
    }
  };

  const handleDownload = () => {
    setPoints((p) => p + 150);
    addBadge("aadhaar-guardian");
    markCompleted("aadhaarCompleted");
  };

  const badgeIcons: Record<string, string> = {
    "start-quest":     "🎯",
    "security-master": "🔐",
    "aadhaar-guardian":"🛡️",
  };

  return (
    <StepModule
      title={t("aadhaarTitle")}
      backPath="/practice"
      speakKey="aadhaarSpeak"
      onComplete={() => markCompleted("aadhaarCompleted")}
      successTitleKey="aadhaarSuccessTitle"
      successMsgKey="aadhaarSuccessMsg"
      learningKeys={["aadhaarLearn1", "aadhaarLearn2", "aadhaarLearn3"]}
      steps={[
        // ── STEP 1: Awareness ──────────────────────────────────────────────
        {
          titleKey: "aadhaarStep1",
          canProceed: true,
          content: (
            <div className="space-y-4">
              {/* Card display */}
              <AadhaarCard masked={false} aadhaarNumber={enteredAadhaar} />

              <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-red-700 text-lg">{t("aadhaarDidYouKnow")}</span>
                </div>
                <ul className="space-y-2 ml-9">
                  <li className="text-sm text-red-700">• {t("aadhaarFact1")}</li>
                  <li className="text-sm text-red-700">• {t("aadhaarFact2")}</li>
                  <li className="text-sm text-red-700">• {t("aadhaarFact3")}</li>
                </ul>
              </div>
            </div>
          ),
        },

        // ── STEP 2: Why Mask ───────────────────────────────────────────────
        {
          titleKey: "aadhaarStep2",
          canProceed: true,
          content: (
            <div className="space-y-4">
              {/* Comparison cards — last 4 always from enteredAadhaar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-red-400 rounded-lg p-4 text-center bg-red-50">
                  <div className="text-lg font-bold text-red-600 mb-2 font-mono break-words">
                    {enteredAadhaar}
                  </div>
                  <span className="text-xs font-bold text-red-600">❌ {t("aadhaarNeverShare")}</span>
                </div>

                <div className="border-2 border-green-400 rounded-lg p-4 text-center bg-green-50">
                  <div className="text-lg font-bold text-green-600 mb-2 font-mono">
                    XXXX XXXX XXXX {cleanAadhaar.slice(-4)}
                  </div>
                  <span className="text-xs font-bold text-green-600">✅ {t("aadhaarSafeShare")}</span>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
                <p className="text-sm text-blue-900">{t("aadhaarMaskedInfo")}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base">{t("aadhaarOfficialTitle")}</h3>
                    <p className="text-xs text-gray-700 mt-1">{t("aadhaarOfficialDesc")}</p>
                  </div>
                </div>
                <a
                  href="https://myaadhaar.uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold py-3 active:scale-95 transition-transform hover:shadow-lg"
                >
                  <ExternalLink size={18} />
                  {t("aadhaarLinkButton")}
                </a>
                <p className="text-xs text-gray-600 text-center">{t("aadhaarLinkNote")}</p>
              </div>
            </div>
          ),
        },

        // ── STEP 3: Simulation ─────────────────────────────────────────────
        {
          titleKey: "aadhaarStep3",
          canProceed: eAadhaarGenerated,
          content: (
            <div className="space-y-4">
              {/* Gamification Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={24} />
                  <div>
                    <p className="text-xs opacity-90">Points</p>
                    <p className="text-2xl font-bold">{points}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge}
                      className="text-2xl transform hover:scale-110 transition-transform cursor-pointer"
                      title={badge}
                    >
                      {badgeIcons[badge]}
                    </div>
                  ))}
                </div>
              </div>

              {!eAadhaarGenerated ? (
                <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
                  {/* Portal header */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-3 text-center">
                    <div className="text-xs font-bold mb-1">
                      Unique Identification Authority of India
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-black">myAadhaar</span>
                      <span className="text-xs">🔐</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* ── Sub-step 0: Enter Aadhaar ── */}
                    {simulationStep === 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-base">
                          Enter Your Aadhaar Number
                        </h3>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Aadhaar Number
                          </label>
                          <input
                            type="text"
                            value={enteredAadhaar}
                            onChange={(e) => setEnteredAadhaar(e.target.value)}
                            className="w-full h-12 px-3 bg-gray-100 text-gray-700 rounded border-b-2 border-blue-600 focus:outline-none text-sm font-mono text-center text-lg"
                            maxLength={20}
                          />
                        </div>
                        <button
                          onClick={handleProceed}
                          disabled={!isValidLength}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded transition-colors"
                        >
                          Verify &amp; Proceed
                        </button>
                      </div>
                    )}

                    {/* ── Sub-step 1: Captcha ── */}
                    {simulationStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-base">Enter Captcha</h3>
                        <p className="text-xs text-gray-600">
                          Please enter the text shown below
                        </p>

                        <div className="h-14 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center font-bold text-lg text-gray-800 tracking-wider font-mono">
                          {captchaCode}
                        </div>

                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                          placeholder="Type the text above"
                          className="w-full h-12 px-3 bg-gray-100 text-gray-700 rounded border-b-2 border-blue-600 focus:outline-none text-sm font-mono"
                        />

                        {captchaInput && (
                          <p className={`text-xs ${validateCaptcha() ? "text-green-600 font-semibold" : "text-red-600"}`}>
                            {validateCaptcha() ? "✓ Correct!" : "✗ Incorrect, try again"}
                          </p>
                        )}

                        <button
                          onClick={handleProceed}
                          disabled={!validateCaptcha()}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded transition-colors"
                        >
                          Send OTP
                        </button>
                      </div>
                    )}

                    {/* ── Sub-step 2: OTP ── */}
                    {simulationStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-base">OTP Verification</h3>

                        {/* Realistic SMS bubble */}
                        <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600 mb-2 font-semibold">💬 SMS</p>
                          <div className="bg-white rounded-lg p-3 border-l-4 border-green-500 space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-bold text-gray-800">VM-UIDAI</p>
                              <p className="text-xs text-gray-500">Just now</p>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Your OTP for Aadhaar Download is{" "}
                              <span className="font-bold bg-yellow-200 px-1 rounded">
                                {DUMMY_OTP}
                              </span>
                              . This OTP is valid for 10 minutes. Do NOT share this OTP
                              with anyone. - UIDAI
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 italic mt-2 text-center">
                            ⚠️ This is a demo message for educational purposes only
                          </p>
                        </div>

                        <p className="text-xs text-gray-700 text-center">
                          Enter the OTP received on your registered mobile number linked
                          to Aadhaar
                        </p>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Enter 6-digit OTP
                          </label>
                          {/* NO placeholder — hint removed */}
                          <input
                            type="text"
                            value={otpInput}
                            onChange={(e) =>
                              setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            className="w-full h-12 px-3 bg-gray-100 text-gray-700 rounded border-b-2 border-blue-600 focus:outline-none text-sm font-mono text-center text-lg tracking-widest"
                            maxLength={6}
                          />
                          {otpInput && validateOTP() && (
                            <p className="text-xs mt-2 text-green-600 font-semibold">
                              ✓ OTP verified!
                            </p>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 text-right">
                          <span className="cursor-not-allowed">Resend OTP</span>
                        </p>

                        <button
                          onClick={handleProceed}
                          disabled={!validateOTP()}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded transition-colors"
                        >
                          Generate eAadhaar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ── Success Screen ── */
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-6 text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 size={48} className="text-green-600 animate-bounce" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-green-800">eAadhaar Generated!</h2>
                    <p className="text-sm text-green-700">
                      Your Masked eAadhaar is ready to download
                    </p>
                  </div>

                  {/* Masked card — reflects EXACTLY what the user entered */}
                  <AadhaarCard masked={true} aadhaarNumber={enteredAadhaar} />

                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 space-y-2 text-xs text-blue-900">
                    <p className="font-semibold">💡 eAadhaar Password Info:</p>
                    <p>
                      Your password:{" "}
                      <span className="font-mono font-bold">JOHN2003</span>
                    </p>
                    <p>Password = First 4 letters of name + Year of birth</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition-colors">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
