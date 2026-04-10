import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router";
import { AlertTriangle, ArrowRight, Activity, ShieldAlert, Send, Phone, ArrowLeft } from "lucide-react";

export function CommunitySiren() {
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<"report" | "simulations">(
    location.state?.activeTab ?? "report"
  );
  const { userUuid, t } = useApp();
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports/recent");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWarnings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/warnings");
      if (res.ok) {
        const w = await res.json();
        setWarnings(w);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchWarnings();
    const iv = setInterval(() => {
      fetchReports();
      fetchWarnings();
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const handlePost = async () => {
    if (!input.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await fetch("http://127.0.0.1:8000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_uuid: userUuid, text: input })
      });
      setInput("");
      fetchReports();
      setTimeout(fetchWarnings, 8000); // give groq time
    } catch (e) {
      console.error(e);
    }
    setIsPosting(false);
  };

  return (
    <div className="h-full bg-[#efeae2] flex flex-col relative">
      <div className="bg-[#0A043C] text-white p-4 pt-6 shadow-md shrink-0">
         <div className="flex items-center justify-between">
           <h1 className="text-2xl font-bold flex items-center gap-2">
             <Activity className="text-red-400" />
             {t('neighborhoodWatch')}
           </h1>
         </div>
         <button
           id="tour-back-button"
           onClick={() => navigate("/emergency-contacts")}
           className="mt-3 flex items-center gap-2 bg-[#D62828]/30 border border-[#D62828]/50 rounded-full px-4 py-2 active:bg-[#D62828]/50 w-max"
           aria-label={t('emergencyContacts')}
         >
           <Phone size={15} className="text-red-300" />
           <span className="text-red-200 text-sm font-bold">{t('emergencyContacts')}</span>
         </button>
      </div>

      <div className="flex bg-white shrink-0 shadow-sm border-b border-gray-200">
        <button
          id="tour-siren-report-tab"
          onClick={() => setActiveTab("report")}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
            activeTab === "report" ? "text-[#D62828] border-b-2 border-[#D62828]" : "text-gray-500"
          }`}
        >
          {t('reportIncidentTab')}
        </button>
        <button
          id="tour-siren-alerts-tab"
          onClick={() => setActiveTab("simulations")}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
            activeTab === "simulations" ? "text-[#D62828] border-b-2 border-[#D62828]" : "text-gray-500"
          }`}
        >
          {t('alertsTab')}
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pb-24">
        {activeTab === "report" && (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-white shadow-sm border-b border-gray-200 shrink-0">
               <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">{t('reportAnIncident')}</h3>
               <div className="flex gap-2 relative">
                  <input 
                    id="tour-siren-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t('whatSuspicious')} 
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none text-[#0A043C] shadow-inner"
                    disabled={isPosting}
                  />
                  <button 
                    disabled={isPosting || !input.trim()}
                    onClick={handlePost}
                    className="bg-[#D62828] text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50"
                  >
                     {isPosting ? <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent" /> : <Send size={20} />}
                  </button>
               </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4">
               <h3 className="text-lg font-bold text-[#0A043C] px-1 mb-1">{t('recentReports')}</h3>
               <div className="space-y-3">
                  {messages.map((m, i) => (
                     <div key={m.id || i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                           <div className="mt-1">
                              <ShieldAlert size={18} className="text-yellow-600" />
                           </div>
                           <div>
                              <p className="text-gray-800 text-sm leading-relaxed font-medium">{m.text}</p>
                              <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block tracking-wider">
                                {t('anonymous')}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === "simulations" && (
          <div className="p-4 flex flex-col gap-4 h-full">
            {warnings.length > 0 ? (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-bold text-[#0A043C]">{t('alert')}</h3>
                  <span className="text-xs font-bold text-gray-500">{currentIdx + 1} of {warnings.length}</span>
                </div>
                <div className="relative">
                  <button 
                    id="tour-siren-first-simulation"
                    onClick={() => {
                      const w = warnings[currentIdx];
                      let scenarioParsed = {};
                      try { scenarioParsed = typeof w.scenario_json === "string" ? JSON.parse(w.scenario_json) : w.scenario_json; } catch(e) {}
                      navigate("/community-quiz", { state: { customWarning: { ...w, scenario: scenarioParsed } } });
                    }}
                    className="w-full text-left active:scale-[0.98] transition-transform shrink-0"
                  >
                    <div className="bg-white rounded-2xl shadow-md border-2 border-[#D62828] overflow-hidden relative">
                      <div className="absolute top-0 right-0 bg-[#D62828] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                        LIVE
                      </div>
                      <div className="p-4 bg-gradient-to-r from-red-50 to-white relative flex flex-col h-full justify-center">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-[#D62828]/10 rounded-full flex items-center justify-center shrink-0">
                             <AlertTriangle size={24} className="text-[#D62828] animate-pulse" strokeWidth={2.5} />
                           </div>
                           <div className="flex-1 min-w-0 pr-4">
                             <h3 className="text-[#0A043C] font-extrabold text-lg leading-tight mb-1 truncate">{warnings[currentIdx].title || "Neighborhood Threat"}</h3>
                             <p className="text-gray-600 text-sm line-clamp-2 leading-snug">{warnings[currentIdx].description || "The AI has analyzed recent reports."}</p>
                           </div>
                         </div>
                         <div className="mt-4 flex items-center justify-between border-t border-red-100 pt-3">
                           <span className="text-[#D62828] font-bold text-sm tracking-wide">{t('playScenario')}</span>
                           <div className="w-8 h-8 rounded-full bg-[#D62828] flex items-center justify-center shadow-md">
                             <ArrowRight size={18} className="text-white" />
                           </div>
                         </div>
                      </div>
                    </div>
                  </button>
                  
                  {warnings.length > 1 && (
                    <div className="flex justify-end mt-2 gap-2">
                      <button 
                        onClick={() => setCurrentIdx(prev => prev > 0 ? prev - 1 : warnings.length - 1)}
                        className="text-xs font-bold text-[#D62828] px-3 py-1 bg-red-50 rounded-full"
                      >
                        Previous
                      </button>
                      <button 
                        onClick={() => setCurrentIdx(prev => (prev + 1) % warnings.length)}
                        className="text-xs font-bold text-[#D62828] px-3 py-1 bg-red-50 rounded-full"
                      >
                        Next Threat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center animate-pulse shadow-sm border border-gray-100 shrink-0 mt-4">
                 <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D62828] rounded-full animate-spin mx-auto mb-3"></div>
                 <p className="text-gray-500 font-medium text-sm">{t('synthesizing')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
