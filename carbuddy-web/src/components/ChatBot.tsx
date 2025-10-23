import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  time: string;
}

const botResponses = [
  {
    keywords: ['oil', 'change'],
    response: "Oil changes are typically recommended every 3,000-5,000 miles. I can help you find nearby garages offering oil change services. Would you like to see available options?",
  },
  {
    keywords: ['brake', 'brakes'],
    response: "If you're experiencing brake issues, it's important to get them checked immediately. I can show you garages that specialize in brake services in your area.",
  },
  {
    keywords: ['price', 'cost', 'how much'],
    response: "Prices vary by service and location. You can view detailed pricing in the Services tab, or I can help you find specific pricing from garages near you.",
  },
  {
    keywords: ['appointment', 'book', 'schedule'],
    response: "I can help you book an appointment! Please select a garage from the Garages tab, and you'll see available time slots for scheduling.",
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: "Hello! I'm your AutoCare assistant. How can I help you today? You can ask me about services, pricing, garage locations, or booking appointments.",
  },
];

export function ChatBot({ isOpen, onClose, isDarkMode }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AutoCare AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const response of botResponses) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response.response;
      }
    }
    
    return "I'm here to help with garage services, pricing, appointments, and more. Could you please rephrase your question or ask about our services?";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: getBotResponse(inputValue),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] z-50 md:rounded-2xl md:shadow-2xl overflow-hidden"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-white'} md:rounded-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-500' : 'bg-gradient-to-r from-orange-600 to-orange-500'} px-4 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">AutoCare Assistant</h3>
                  <p className="text-xs text-blue-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot'
                      ? isDarkMode ? 'bg-orange-900' : 'bg-orange-100'
                      : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    {message.type === 'bot' ? (
                      <Bot className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    ) : (
                      <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] ${
                      message.type === 'bot'
                        ? isDarkMode
                          ? 'bg-gray-900 text-gray-100'
                          : 'bg-gray-100 text-gray-900'
                        : 'bg-orange-600 text-white'
                    } ${message.type === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                      <p>{message.content}</p>
                    </div>
                    <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {message.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`px-4 py-4 border-t ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
                />
                <Button
                  onClick={handleSend}
                  className="bg-orange-600 hover:bg-orange-700 px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
