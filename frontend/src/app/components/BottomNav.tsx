import { Link, useLocation } from 'react-router';
import { Home, Shield, Trophy, BookOpen, Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BottomNav() {
  const location = useLocation();
  const { t } = useApp();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/practice', icon: BookOpen, label: t('practice') },
    { path: '/detect', icon: Shield, label: t('detectScams') },
    { path: '/progress', icon: Trophy, label: t('progress') },
    { path: '/community-siren', icon: Megaphone, label: t('siren') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#122D42] border-t border-white/15 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              id={`tour-${item.path.replace('/', '') || 'home'}`}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[72px] ${
                isActive
                  ? 'bg-[#03506F] text-white'
                  : 'text-white/70 active:bg-white/10'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={2.5} />
              <span className="text-xs leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
