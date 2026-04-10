import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useProgress } from '../contexts/ProgressContext';
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ScamMessage {
  id: number;
  type: 'sms' | 'email';
  from: string;
  subject?: string;
  content: string;
  suspiciousParts: string[];
  explanation: string;
}

const scamMessages: ScamMessage[] = [
  {
    id: 1,
    type: 'sms',
    from: '+91-XXXXX',
    content: 'URGENT: Your bank account will be blocked! Click here immediately: bit.ly/fake123 and enter your OTP to verify.',
    suspiciousParts: ['URGENT', 'Click here immediately', 'bit.ly/fake123', 'enter your OTP'],
    explanation: 'Banks never ask for OTP via SMS. Shortened links are often used by scammers. Urgency is a red flag.',
  },
  {
    id: 2,
    type: 'sms',
    from: 'KYC-Update',
    content: 'Your KYC is pending. Update now or account will be suspended. Share OTP: 8765432109',
    suspiciousParts: ['KYC is pending', 'suspended', 'Share OTP', '8765432109'],
    explanation: 'Banks never ask you to share OTP. Legitimate KYC updates happen through official channels only.',
  },
  {
    id: 3,
    type: 'sms',
    from: 'Prize Winner',
    content: 'Congratulations! You won ₹50,000 lottery. Call us at 9876543210 with your Aadhaar and bank details to claim.',
    suspiciousParts: ['won ₹50,000 lottery', 'Aadhaar and bank details'],
    explanation: 'You cannot win a lottery you never entered. Never share Aadhaar or bank details over phone.',
  },
];

export default function Detect() {
  const navigate = useNavigate();
  const { t } = useApp();
  const { completeModule, earnBadge } = useProgress();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentMessage = scamMessages[currentMessageIndex];

  const handleWordClick = (word: string) => {
    if (showFeedback) return;

    setSelectedWords(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      return [...prev, word];
    });
  };

  const handleCheckAnswer = () => {
    // Check if at least one suspicious part is selected
    const hasCorrectSelection = selectedWords.some(word =>
      currentMessage.suspiciousParts.some(part => part.toLowerCase().includes(word.toLowerCase()))
    );

    setIsCorrect(hasCorrectSelection);
    setShowFeedback(true);

    if (hasCorrectSelection && currentMessageIndex === scamMessages.length - 1) {
      completeModule('red-flag');
      earnBadge('scam-detector');
    }
  };

  const handleNext = () => {
    if (currentMessageIndex < scamMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
      setSelectedWords([]);
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      navigate('/');
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const renderContentWithSelection = () => {
    const words = currentMessage.content.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?:]/g, '');
      const isSelected = selectedWords.includes(cleanWord);
      const isSuspicious = currentMessage.suspiciousParts.some(part =>
        part.toLowerCase().includes(cleanWord.toLowerCase())
      );

      return (
        <span
          key={index}
          onClick={() => handleWordClick(cleanWord)}
          className={`inline-block px-1 py-0.5 mx-0.5 my-0.5 rounded cursor-pointer transition-all ${
            showFeedback && isSuspicious
              ? 'bg-[#D62828] text-white'
              : isSelected
              ? 'bg-[#F77F00] text-white'
              : 'hover:bg-white/10'
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <Layout showBottomNav={false}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-[#122D42] px-4 py-4 border-b border-white/15">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-4 active:opacity-70"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('back')}</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">{t('redFlagTitle')}</h2>
              <p className="text-white/70">{t('redFlagDesc')}</p>
            </div>
            <div className="text-white/70 text-sm">
              {currentMessageIndex + 1} / {scamMessages.length}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-auto">
          {/* Instructions */}
          <div className="bg-[#F77F00]/20 border border-[#F77F00] rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#F77F00] flex-shrink-0 mt-0.5" />
            <p className="text-white">{t('tapSuspicious')}</p>
          </div>

          {/* Message Card */}
          <div className="bg-[#122D42] rounded-xl overflow-hidden border border-white/10">
            {/* Message Header */}
            <div className="bg-[#0A043C] px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  {currentMessage.type === 'sms' ? 'SMS Message' : 'Email'}
                </span>
                <span className="text-white/50 text-sm">Just now</span>
              </div>
              <p className="text-white mt-1">From: {currentMessage.from}</p>
              {currentMessage.subject && (
                <p className="text-white/80 mt-1">Subject: {currentMessage.subject}</p>
              )}
            </div>

            {/* Message Body */}
            <div className="p-4">
              <div className="text-white leading-relaxed text-base select-none">
                {renderContentWithSelection()}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`rounded-xl p-4 space-y-3 ${
                isCorrect
                  ? 'bg-[#3E5F44]/20 border border-[#3E5F44]'
                  : 'bg-[#D62828]/20 border border-[#D62828]'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-[#3E5F44] flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#D62828] flex-shrink-0" />
                )}
                <h4 className="text-white">{isCorrect ? t('correct') : t('incorrect')}</h4>
              </div>

              <div className="bg-[#0A043C]/50 rounded-lg p-4">
                <p className="text-white/90 mb-2">{t('whyScam')}</p>
                <p className="text-white/80 leading-relaxed">{currentMessage.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 bg-[#122D42] border-t border-white/15 space-y-3">
          {!showFeedback ? (
            <>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedWords.length === 0}
                className={`w-full h-14 rounded-xl font-semibold transition-all ${
                  selectedWords.length > 0
                    ? 'bg-[#F77F00] text-white active:scale-[0.98]'
                    : 'bg-[#122D42] text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                Check Answer
              </button>
              <button
                onClick={handleReset}
                className="w-full h-14 rounded-xl bg-[#122D42] text-white font-semibold active:scale-[0.98] transition-transform border border-white/10"
              >
                Clear Selection
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="w-full h-14 rounded-xl bg-[#03506F] text-white font-semibold active:scale-[0.98] transition-transform"
            >
              {currentMessageIndex < scamMessages.length - 1 ? t('next') : 'Complete'}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
