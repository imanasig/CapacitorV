import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useProgress } from '../contexts/ProgressContext';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

export default function Practice() {
  const navigate = useNavigate();
  const { t } = useApp();
  const { completeModule, earnBadge } = useProgress();
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  const totalSteps = 3;

  const isWeakPin = (pinValue: string) => {
    // Check for common weak patterns
    if (pinValue === '123456' || pinValue === '111111' || pinValue === '000000') {
      return true;
    }
    if (/^(\d)\1+$/.test(pinValue)) return true; // All same digits
    return false;
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 6) {
      setPin(value);
      
      if (value.length === 6) {
        if (isWeakPin(value)) {
          setFeedback({ type: 'warning', message: t('weakPin') });
        } else {
          setFeedback({ type: 'success', message: t('strongPin') });
        }
      } else {
        setFeedback({ type: '', message: '' });
      }
    }
  };

  const handleConfirmPinChange = (value: string) => {
    if (value.length <= 6) {
      setConfirmPinValue(value);
      
      if (value.length === 6) {
        if (value === pin) {
          setFeedback({ type: 'success', message: t('pinMatch') });
        } else {
          setFeedback({ type: 'error', message: t('pinNoMatch') });
        }
      } else {
        setFeedback({ type: '', message: '' });
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && pin.length === 6 && !isWeakPin(pin)) {
      setStep(2);
      setFeedback({ type: '', message: '' });
    } else if (step === 2 && confirmPinValue === pin) {
      setStep(3);
      completeModule('upi-pin');
      earnBadge('pin-expert');
    }
  };

  const handleReset = () => {
    setStep(1);
    setPin('');
    setConfirmPinValue('');
    setFeedback({ type: '', message: '' });
  };

  const canProceed = 
    (step === 1 && pin.length === 6 && !isWeakPin(pin)) ||
    (step === 2 && confirmPinValue === pin && confirmPinValue.length === 6);

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
          <div>
            <h2 className="text-white mb-1">{t('upiPinTitle')}</h2>
            <p className="text-white/70">{t('upiPinDesc')}</p>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="px-4 py-4 bg-[#0A043C]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70">
                {t('step')} {step} {t('of')} {totalSteps - 1}
              </span>
              <span className="text-white/70">{Math.round((step / 2) * 100)}%</span>
            </div>
            <div className="h-3 bg-[#122D42] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#03506F] transition-all duration-500 rounded-full"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 px-4 py-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Lock className="w-16 h-16 mx-auto mb-4 text-[#03506F]" strokeWidth={2} />
                <h3 className="text-white mb-2">{t('enterPin')}</h3>
                <p className="text-white/70">{t('pinHint')}</p>
              </div>

              {/* PIN Input */}
              <div className="space-y-3">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="w-full h-16 px-6 bg-[#122D42] text-white text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-[#03506F] focus:outline-none focus:border-[#03506F] focus:ring-4 focus:ring-[#03506F]/20"
                  placeholder="••••••"
                  autoFocus
                />

                {/* Feedback */}
                {feedback.message && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      feedback.type === 'success'
                        ? 'bg-[#3E5F44]/20 border border-[#3E5F44]'
                        : 'bg-[#F77F00]/20 border border-[#F77F00]'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-[#3E5F44] flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-[#F77F00] flex-shrink-0" />
                    )}
                    <p className="text-white">{feedback.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#3E5F44]" strokeWidth={2} />
                <h3 className="text-white mb-2">{t('confirmPin')}</h3>
                <p className="text-white/70">Enter your PIN again</p>
              </div>

              {/* Confirm PIN Input */}
              <div className="space-y-3">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={confirmPinValue}
                  onChange={(e) => handleConfirmPinChange(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="w-full h-16 px-6 bg-[#122D42] text-white text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-[#03506F] focus:outline-none focus:border-[#03506F] focus:ring-4 focus:ring-[#03506F]/20"
                  placeholder="••••••"
                  autoFocus
                />

                {/* Feedback */}
                {feedback.message && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      feedback.type === 'success'
                        ? 'bg-[#3E5F44]/20 border border-[#3E5F44]'
                        : 'bg-[#D62828]/20 border border-[#D62828]'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-[#3E5F44] flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-[#D62828] flex-shrink-0" />
                    )}
                    <p className="text-white">{feedback.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-[#3E5F44] rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-white">{t('pinSuccess')}</h3>
              <p className="text-white/80">{t('pinSuccessMsg')}</p>

              <div className="bg-[#3E5F44]/20 border border-[#3E5F44] rounded-xl p-6 space-y-3">
                <h4 className="text-white">What you learned:</h4>
                <ul className="text-white/90 space-y-2 text-left">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3E5F44] flex-shrink-0 mt-0.5" />
                    <span>Avoid simple patterns like 123456</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3E5F44] flex-shrink-0 mt-0.5" />
                    <span>Create a strong 6-digit PIN</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3E5F44] flex-shrink-0 mt-0.5" />
                    <span>Always confirm your PIN carefully</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 bg-[#122D42] border-t border-white/15">
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`w-full h-14 rounded-xl font-semibold transition-all ${
                canProceed
                  ? 'bg-[#03506F] text-white active:scale-[0.98]'
                  : 'bg-[#122D42] text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              {t('next')}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 rounded-xl bg-[#03506F] text-white font-semibold active:scale-[0.98] transition-transform"
              >
                Back to Home
              </button>
              <button
                onClick={handleReset}
                className="w-full h-14 rounded-xl bg-[#122D42] text-white font-semibold active:scale-[0.98] transition-transform border border-white/10"
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
