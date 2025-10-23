import { Wrench, Package, MessageCircleQuestion, Users, Mail } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAskClick: () => void;
  isDarkMode: boolean;
}

export function BottomNav({ activeTab, setActiveTab, onAskClick, isDarkMode }: BottomNavProps) {
  const navItems = [
    { id: 'garages', icon: Wrench, label: 'Garages' },
    { id: 'auto-parts', icon: Package, label: 'Auto Parts' },
    { id: 'ask', icon: MessageCircleQuestion, label: 'ASK', isCenter: true },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={onAskClick}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400' 
                    : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600'
                }`}
                style={{ marginTop: '-20px' }}
              >
                <Icon className="w-7 h-7 text-white" />
                <span className="text-xs text-white">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                isActive
                  ? isDarkMode
                    ? 'text-orange-400 bg-orange-950/50'
                    : 'text-orange-600 bg-orange-50'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
