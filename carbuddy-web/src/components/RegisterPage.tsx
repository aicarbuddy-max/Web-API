import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { UserPlus, Car } from 'lucide-react';

interface RegisterPageProps {
  isDarkMode: boolean;
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({ isDarkMode, onSwitchToLogin, onRegisterSuccess }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password);
      toast.success('Registration successful! Please login.');
      onRegisterSuccess();
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900 border-gray-800' : ''}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className={`text-2xl text-center ${isDarkMode ? 'text-white' : ''}`}>
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to start using CarBuddy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className={isDarkMode ? 'text-gray-200' : ''}>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={isDarkMode ? 'text-gray-200' : ''}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={isDarkMode ? 'text-gray-200' : ''}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={isDarkMode ? 'text-gray-200' : ''}>
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Already have an account?{' '}
            </span>
            <button
              onClick={onSwitchToLogin}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Login here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
