import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Phone, ArrowRight, Globe } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-slate-800 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-slate-900 tracking-tight">
            {t('brandName')}
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-500 border-l border-slate-200 pl-3">
            Emergency & Home Care Intake
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors duration-150"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded-md transition-colors duration-150"
          >
            <span>Operator Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col justify-center">
        {/* Visible Hotline Dial-in */}
        <div className="inline-flex items-center gap-2 self-start bg-white border border-slate-200 rounded-full px-3.5 py-1 text-xs font-medium text-slate-700 mb-6 shadow-xs">
          <Phone className="w-3.5 h-3.5 text-[#1F6F6B]" />
          <span>Call 24/7 Helpline: </span>
          <span className="font-semibold text-slate-900 font-mono">+91 11 4084 4899</span>
        </div>

        {/* Short Headline & One-line explanation */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl leading-tight">
          {language === 'en'
            ? 'One phone call into a verified, dispatched home nurse.'
            : 'एक फोन कॉल से सत्यापित होम नर्स का त्वरित डिस्पैच।'}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
          {language === 'en'
            ? 'Callers speak in natural Hindi or Hinglish. Our voice agent captures medical requirements in real time and matches verified care professionals in under 60 seconds.'
            : 'कॉलर अपनी स्वाभाविक भाषा (हिंदी या हिंग्लिश) में बात करते हैं। वॉयस एजेंट वास्तविक समय में स्थिति दर्ज कर 60 सेकंड से भी कम समय में नर्स मैच करता है।'}
        </p>

        {/* 3-Step How It Works Workflow */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 bg-white rounded-md border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {language === 'en' ? 'Voice Intake' : 'वॉयस इनटेक'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Caller calls +91 11 4084 4899 and describes patient symptoms, required hours, and area in Hindi or Hinglish.'
                : 'कॉलर हेल्पलाइन पर फोन करके हिंदी या हिंग्लिश में मरीज की स्थिति, समय और पता बताते हैं।'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-white rounded-md border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {language === 'en' ? 'Details & Triage' : 'विवरण व ट्राइएज'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'AI extracts 5 core parameters in real time and screens for red-flag emergencies, routing critical calls to 112.'
                : 'एआई तुरंत 5 मुख्य विवरण दर्ज करता है और जीवन-रक्षक आपात स्थिति होने पर तुरंत 112 को अलर्ट करता है।'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-white rounded-md border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {language === 'en' ? 'Nurse Dispatched' : 'नर्स डिस्पैच'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Nearby verified nurse is scored, assigned, and confirmed via SMS in under 60 seconds with live arrival tracking.'
                : 'निकटतम सत्यापित नर्स को मैच कर एसएमएस द्वारा पुष्टि भेजी जाती है और ऑपरेटर डेस्क पर ट्रैकिंग शुरू होती है।'}
            </p>
          </div>
        </div>

        {/* Operator Desk CTA */}
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded-md transition-colors duration-150"
          >
            <span>Open Operator Coordination Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-xs text-slate-500">
            Internal dispatch portal for coordinators
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>CareConnect • Clinical Care Coordination & Dispatch System</span>
        <span>Standard Operating Helpline: +91 11 4084 4899</span>
      </footer>
    </div>
  );
};
