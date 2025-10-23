import { User, Moon, Sun, Bell, CreditCard, MapPin, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface ProfilePageProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function ProfilePage({ isDarkMode, setIsDarkMode }: ProfilePageProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className={isDarkMode ? 'bg-orange-900 text-orange-300 text-xl' : 'bg-orange-100 text-orange-700 text-xl'}>
              {user ? getInitials(user.username) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{user?.username || 'User'}</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{user?.email || 'user@email.com'}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Role: {user?.role || 'User'}
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <User className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </Card>

      {/* Settings */}
      <div>
        <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`} />
                ) : (
                  <Sun className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`} />
                )}
                <div>
                  <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Dark Mode</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toggle dark theme
                  </p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Notifications</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage notification preferences
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Payment Methods</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your payment options
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Saved Addresses</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your saved locations
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* My Activity */}
      <div>
        <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>My Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Service History</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View past services and bookings
            </p>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>My Reviews</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reviews you've written
            </p>
          </Card>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className={`w-full ${isDarkMode ? 'border-red-900 text-red-400 hover:bg-red-950' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
