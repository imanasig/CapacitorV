import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useProgress } from '../contexts/ProgressContext';
import { ArrowLeft, Phone, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'scammer' | 'user';
  text: string;
  isCorrect?: boolean;
}

interface ScenarioStep {
  scammerMessage: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const scenario: ScenarioStep[] = [
  {
    scammerMessage: 'Hello! This is from your bank. We detected suspicious activity on your account.',
    options: [
      {
        text: 'What suspicious activity?',
        isCorrect: true,
        feedback: 'Good! Always verify before taking action.',
      },
      {
        text: 'Okay, what should I do?',
        isCorrect: false,
        feedback: 'Never agree immediately. Always question unexpected calls.',
      },
    ],
  },
  {
    scammerMessage: 'Your account will be blocked. We need to verify your identity. Please share your OTP.',
    options: [
      {
        text: 'Sure, let me get it.',
        isCorrect: false,
        feedback: 'DANGER! Never share OTP with anyone, even if they claim to be from your bank.',
      },
      {
        text: 'I will not share OTP. I will call my bank directly.',
        isCorrect: true,
        feedback: 'Perfect! Banks NEVER ask for OTP. You protected yourself!',
      },
    ],
  },
  {
    scammerMessage: 'Sir, it is urgent! Your money will be lost. Just tell me the 6-digit code.',
    options: [
      {
        text: 'Let me give you the OTP.',
        isCorrect: false,
        feedback: 'DANGER! Creating urgency is a scammer tactic. Never fall for it.',
      },
      {
        text: 'I am ending this call and contacting my bank.',
        isCorrect: true,
        feedback: 'Excellent! You identified the scam and protected yourself!',
      },
    ],
  },
];

export default function Simulator() {
  const navigate = useNavigate();
  const { t } = useApp();
  const { completeModule, earnBadge } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'scammer',
      text: scenario[0].scammerMessage,
    },
  ]);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  }>({ show: false, isCorrect: false, message: '' });
  const [isComplete, setIsComplete] = useState(false);

  const handleOptionSelect = (option: { text: string; isCorrect: boolean; feedback: string }) => {
    // Add user's choice to messages
    const userMessage: ChatMessage = {
      id: messages.length,
      sender: 'user',
      text: option.text,
      isCorrect: option.isCorrect,
    };

    setMessages(prev => [...prev, userMessage]);
    setFeedback({ show: true, isCorrect: option.isCorrect, message: option.feedback });

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentStep < scenario.length - 1) {
        setCurrentStep(prev => prev + 1);
        setMessages(prev => [
          ...prev,
          {
            id: prev.length,
            sender: 'scammer',
            text: scenario[currentStep + 1].scammerMessage,
          },
        ]);
        setFeedback({ show: false, isCorrect: false, message: '' });
      } else {
        setIsComplete(true);
        if (option.isCorrect) {
          completeModule('scam-simulator');
          earnBadge('safe-user');
        }
      }
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setMessages([
      {
        id: 0,
        sender: 'scammer',
        text: scenario[0].scammerMessage,
      },
    ]);
    setFeedback({ show: false, isCorrect: false, message: '' });
    setIsComplete(false);
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
              <h2 className="text-white mb-1">{t('simulatorTitle')}</h2>
              <p className="text-white/70">{t('simulatorDesc')}</p>
            </div>
          </div>
        </div>

        {/* Call Header */}
        <div className="bg-[#D62828] px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Incoming Call</p>
            <p className="text-white/80 text-sm">Unknown Number</p>
          </div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-4 py-6 space-y-4 overflow-auto bg-[#0A043C]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.sender === 'scammer'
                    ? 'bg-[#122D42] text-white rounded-tl-none'
                    : message.isCorrect
                    ? 'bg-[#3E5F44] text-white rounded-tr-none'
                    : 'bg-[#D62828] text-white rounded-tr-none'
                }`}
              >
                {message.sender === 'scammer' && (
                  <p className="text-[#D62828] text-xs mb-1 font-semibold">⚠️ Scammer</p>
                )}
                <p className="leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Feedback Message */}
          {feedback.show && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-[#3E5F44]/20 border border-[#3E5F44]'
                  : 'bg-[#D62828]/20 border border-[#D62828]'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-[#3E5F44] flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-[#D62828] flex-shrink-0" />
              )}
              <p className="text-white leading-relaxed">{feedback.message}</p>
            </div>
          )}

          {/* Complete Message */}
          {isComplete && (
            <div className="bg-[#3E5F44]/20 border border-[#3E5F44] rounded-xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#3E5F44] mx-auto" />
              <h3 className="text-white">Simulation Complete!</h3>
              <p className="text-white/90 leading-relaxed">
                You have learned how to identify and handle scam calls safely. Remember: Banks
                never ask for OTP or PIN over calls.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 bg-[#122D42] border-t border-white/15">
          {!isComplete && !feedback.show ? (
            <div className="space-y-3">
              <p className="text-white/70 text-center mb-3">{t('yourChoice')}</p>
              {scenario[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full px-4 py-4 rounded-xl bg-[#03506F] text-white text-left active:scale-[0.98] transition-transform border border-white/10"
                >
                  {option.text}
                </button>
              ))}
            </div>
          ) : isComplete ? (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 rounded-xl bg-[#03506F] text-white font-semibold active:scale-[0.98] transition-transform"
              >
                Back to Home
              </button>
              <button
                onClick={handleRestart}
                className="w-full h-14 rounded-xl bg-[#122D42] text-white font-semibold active:scale-[0.98] transition-transform border border-white/10"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="text-center text-white/70">Processing your response...</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
