'use client';

import { useState } from 'react';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  pricing: 'Our pricing depends on distance, package size, and delivery speed. You can get an instant quote by filling out our quote form or booking directly.',
  tracking: 'To track your shipment, enter your tracking code on our tracking page. You\'ll see real-time updates on your package location.',
  booking: 'To book a transport, click on "New Booking" in the navigation menu. Fill in the pickup and delivery details, and we\'ll take care of the rest!',
  contact: 'You can reach us at info@sghtrasporti.com or call +39 123 456 789. Our support team is available Monday-Friday, 9AM-6PM.',
  delivery: 'Standard delivery takes 2-5 business days depending on the distance. Express delivery options are available for urgent shipments.',
  payment: 'We accept bank transfer, credit cards, PayPal, and cash payments. Invoices are sent via email after delivery confirmation.',
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m the SGH Trasporti assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    // Simple keyword matching
    if (userInput.includes('price') || userInput.includes('cost') || userInput.includes('quote')) {
      return FAQ_RESPONSES.pricing;
    }
    if (userInput.includes('track') || userInput.includes('where') || userInput.includes('location')) {
      return FAQ_RESPONSES.tracking;
    }
    if (userInput.includes('book') || userInput.includes('order') || userInput.includes('shipment')) {
      return FAQ_RESPONSES.booking;
    }
    if (userInput.includes('contact') || userInput.includes('phone') || userInput.includes('email')) {
      return FAQ_RESPONSES.contact;
    }
    if (userInput.includes('deliver') || userInput.includes('time') || userInput.includes('how long')) {
      return FAQ_RESPONSES.delivery;
    }
    if (userInput.includes('payment') || userInput.includes('pay') || userInput.includes('invoice')) {
      return FAQ_RESPONSES.payment;
    }

    // Default response
    return 'I\'m here to help! You can ask me about pricing, tracking, booking, delivery times, or contact information. For complex inquiries, please contact our support team.';
  };

  const quickReplies = [
    'Get a quote',
    'Track shipment',
    'Delivery times',
    'Contact support',
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <FiMessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[600px] max-h-[calc(100vh-3rem)]">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FiMessageCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold">SGH Trasporti</h3>
                <p className="text-xs text-blue-100">Usually replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <FiUser size={14} className="text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Support Bot</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t space-y-2">
              <p className="text-xs text-gray-600 font-medium">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => {
                      setInputValue(reply);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by SGH Trasporti AI Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
}
