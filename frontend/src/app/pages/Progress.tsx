import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useProgress } from '../contexts/ProgressContext';
import { CheckCircle2, Lock, Trophy, Shield, Brain, Target } from 'lucide-react';

export default function Progress() {
  const { t } = useApp();
  const { modules, badges } = useProgress();

  const completedCount = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);
  const earnedBadges = badges.filter(b => b.earned);

  const badgeIcons: Record<string, any> = {
    'safe-user': Shield,
    'scam-detector': Target,
    'pin-expert': Lock,
  };

  const moduleIcons: Record<string, any> = {
    'upi-pin': Lock,
    'red-flag': Shield,
    'scam-simulator': Brain,
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#3E5F44] mb-4">
            <Trophy className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-white mb-2">{t('progressTitle')}</h2>
          <p className="text-white/80">Track your learning journey</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-[#122D42] rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white">Overall Progress</h3>
            <span className="text-[#3E5F44] font-semibold">{progressPercentage}%</span>
          </div>
          <div className="h-4 bg-[#0A043C] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#03506F] to-[#3E5F44] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-white/70 text-center">
            {completedCount} of {totalModules} modules completed
          </p>
        </div>

        {/* Completed Modules */}
        <div className="mb-6">
          <h3 className="text-white mb-4">{t('completedModules')}</h3>
          <div className="space-y-3">
            {modules.map((module) => {
              const Icon = moduleIcons[module.id] || Lock;
              return (
                <div
                  key={module.id}
                  className={`bg-[#122D42] rounded-xl p-4 border transition-all ${
                    module.completed
                      ? 'border-[#3E5F44]'
                      : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        module.completed ? 'bg-[#3E5F44]' : 'bg-[#0A043C]'
                      }`}
                    >
                      {module.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                      ) : (
                        <Icon className="w-6 h-6 text-white/50" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-1">{module.title}</h4>
                      <p className="text-white/70 text-sm">
                        {module.completed ? t('completed') : t('inProgress')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-white mb-4">{t('badges')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => {
              const Icon = badgeIcons[badge.id] || Trophy;
              return (
                <div
                  key={badge.id}
                  className={`bg-[#122D42] rounded-xl p-4 border text-center transition-all ${
                    badge.earned
                      ? 'border-[#F77F00]'
                      : 'border-white/10 opacity-60'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      badge.earned
                        ? 'bg-gradient-to-br from-[#F77F00] to-[#D62828]'
                        : 'bg-[#0A043C]'
                    }`}
                  >
                    {badge.earned ? (
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    ) : (
                      <Lock className="w-8 h-8 text-white/50" strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-white text-sm leading-tight">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouragement Message */}
        {progressPercentage === 100 ? (
          <div className="mt-8 bg-gradient-to-r from-[#3E5F44] to-[#03506F] rounded-2xl p-6 text-center">
            <Trophy className="w-12 h-12 text-white mx-auto mb-3" strokeWidth={2} />
            <h3 className="text-white mb-2">Congratulations!</h3>
            <p className="text-white/90 leading-relaxed">
              You have completed all modules and earned all badges. You are now a digital safety
              expert!
            </p>
          </div>
        ) : (
          <div className="mt-8 bg-[#03506F]/20 border border-[#03506F] rounded-xl p-4 text-center">
            <p className="text-white/90 leading-relaxed">
              Keep learning! Complete all modules to become a digital safety expert.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
