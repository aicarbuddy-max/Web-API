import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Car } from 'lucide-react';

interface LoginPageProps {
  isDarkMode: boolean;
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ isDarkMode, onSwitchToRegister, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      onLoginSuccess();
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
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
            Welcome to CarBuddy
          </CardTitle>
          <CardDescription className="text-center">
            Login to find the best car services near you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Don't have an account?{' '}
            </span>
            <button
              onClick={onSwitchToRegister}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
