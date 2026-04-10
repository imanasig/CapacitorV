import { useNavigate } from "react-router";
import { ArrowLeft, Phone, Globe, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";

const CONTACTS = [
  {
    categoryKey: "emergencyCat",
    items: [
      { nameKey: "contactIntegrated", number: "112",   type: "call" },
      { nameKey: "contactPolice",                      number: "100",           type: "call" },
      { nameKey: "contactAmbulance",  number: "102",           type: "call" },
      { nameKey: "contactFire",                number: "101",           type: "call" },
      { nameKey: "contactRoadAccident",      number: "1073",          type: "call" },
      { nameKey: "contactDisaster", number: "1070",       type: "call" },
    ],
  },
  {
    categoryKey: "cyberCat",
    items: [
      { nameKey: "contactCyberCrime",        number: "1930",          type: "call" },
      { nameKey: "contactCyberPortal",          number: "https://cybercrime.gov.in", type: "web" },
      { nameKey: "contactRBIFraud",           number: "14440",         type: "call" },
      { nameKey: "contactRBIComplaint",        number: "https://sachet.rbi.org.in", type: "web" },
      { nameKey: "contactTRAI",     number: "1909",          type: "call" },
    ],
  },
  {
    categoryKey: "womenCat",
    items: [
      { nameKey: "contactWomenHelpline",              number: "181",           type: "call" },
      { nameKey: "contactDomesticViolence",  number: "181",           type: "call" },
      { nameKey: "contactNCW", number: "7827170170",  type: "call" },
      { nameKey: "contactChildHelpline",              number: "1098",          type: "call" },
    ],
  },
  {
    categoryKey: "financeCat",
    items: [
      { nameKey: "contactConsumerHelpline",  number: "1915",          type: "call" },
      { nameKey: "contactSEBI",      number: "1800-22-7575",  type: "call" },
      { nameKey: "contactIRDAI",       number: "155255",        type: "call" },
      { nameKey: "contactPMDaksh",           number: "1800110396",    type: "call" },
    ],
  },
  {
    categoryKey: "otherGovCat",
    items: [
      { nameKey: "contactSeniorCitizen",    number: "14567",         type: "call" },
      { nameKey: "contactUIDAI",             number: "1947",          type: "call" },
      { nameKey: "contactFSSAI",           number: "1800112100",    type: "call" },
      { nameKey: "contactTourist",            number: "1800-11-1363",  type: "call" },
      { nameKey: "contactRailway",            number: "139",           type: "call" },
      { nameKey: "contactLPG",                    number: "1906",          type: "call" },
    ],
  },
];

export function EmergencyContacts() {
  const navigate = useNavigate();
  const { t } = useApp();

  const handleTap = (item: { number: string; type: string }) => {
    if (item.type === "call") {
      window.location.href = `tel:${item.number}`;
    } else {
      window.open(item.number, "_blank");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f6]">
      {/* Header */}
      <div className="bg-[#0A043C] text-white px-4 pt-5 pb-6 rounded-b-3xl shadow-lg shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button
            id="tour-back-button"
            onClick={() => navigate("/")}
            className="p-2 bg-white/10 rounded-full active:bg-white/20"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={26} className="text-[#F77F00]" />
            <h1 className="text-xl font-bold">{t('emergencyContactsTitle')}</h1>
          </div>
        </div>
        <p className="text-sm text-gray-300 pl-1">
          {t('emergencyContactsDesc')}
        </p>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto pb-8 px-4 pt-4 space-y-5">
        {CONTACTS.map((section) => (
          <div key={section.categoryKey}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
              {t(section.categoryKey)}
            </p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleTap(item)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 active:bg-gray-50 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === "call"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {item.type === "call" ? (
                      <Phone size={18} className="text-green-600" />
                    ) : (
                      <Globe size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{t(item.nameKey)}</p>
                    <p
                      className={`text-sm font-bold mt-0.5 ${
                        item.type === "call" ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {item.type === "call" ? item.number : t('openWebsite')}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.type === "call"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type === "call" ? t('callLabel') : t('webLabel')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
