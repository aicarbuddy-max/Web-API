import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface ContactPageProps {
  isDarkMode: boolean;
}

export function ContactPage({ isDarkMode }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Contact Us</h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Get in touch with our support team
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-orange-950' : 'bg-orange-50'} flex items-center justify-center`}>
              <Phone className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
              <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>1-800-AUTO-CARE</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-orange-950' : 'bg-orange-50'} flex items-center justify-center`}>
              <Mail className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
              <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>support@autocare.com</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-orange-950' : 'bg-orange-50'} flex items-center justify-center`}>
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
              <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>123 Auto Street, NY 10001</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Send us a message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}
            />
          </div>

          <div>
            <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}
            />
          </div>

          <div>
            <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Phone (optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}
            />
          </div>

          <div>
            <Label htmlFor="message" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you?"
              required
              className={`min-h-32 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </Card>
    </div>
  );
}
