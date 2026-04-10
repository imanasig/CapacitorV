import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { BookOpen, Shield, Brain, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useApp();

  const actions = [
    {
      icon: BookOpen,
      title: t('practice'),
      description: 'Learn by doing',
      path: '/practice',
      color: '#03506F',
    },
    {
      icon: Shield,
      title: t('detectScams'),
      description: 'Spot fake messages',
      path: '/detect',
      color: '#F77F00',
    },
    {
      icon: Brain,
      title: t('testYourself'),
      description: 'Test your knowledge',
      path: '/simulator',
      color: '#3E5F44',
    },
  ];

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#03506F] mb-4">
            <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-white mb-2">{t('appTitle')}</h2>
          <p className="text-white/80">{t('appSubtitle')}</p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full bg-[#122D42] rounded-2xl p-6 text-left active:scale-[0.98] transition-transform border border-white/10"
                style={{
                  boxShadow: `0 4px 0 ${action.color}40`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: action.color }}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{action.title}</h3>
                    <p className="text-white/70 text-base">{action.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/50 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-[#3E5F44]/20 border border-[#3E5F44] rounded-xl p-4">
          <p className="text-white/90 text-center leading-relaxed">
            Safe learning space. Practice without risk. Build confidence.
          </p>
        </div>
      </div>
    </Layout>
  );
}
