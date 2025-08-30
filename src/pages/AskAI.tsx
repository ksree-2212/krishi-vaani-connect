import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RootState } from '@/store';
import { addMessage, setListening, setProcessing } from '@/store/slices/aiSlice';
import { voiceService } from '@/services/voiceService';
import { ArrowLeft, Mic, Send, MessageCircle, User, Bot } from 'lucide-react';

const AskAI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { chatHistory, isListening, isProcessing } = useSelector((state: RootState) => state.ai);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const speakTitle = async () => {
      await voiceService.speak(t('ai.title'), currentLanguage);
    };

    speakTitle();
  }, [t, currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleVoiceInput = async () => {
    dispatch(setListening(true));
    try {
      await voiceService.speak(t('ai.tapToSpeak'), currentLanguage);
      const result = await voiceService.listen(currentLanguage);
      setInputMessage(result);
      handleSendMessage(result);
    } catch (error) {
      console.error('Voice input failed:', error);
    } finally {
      dispatch(setListening(false));
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage;
    if (!messageText.trim()) return;

    // Add user message
    dispatch(addMessage({
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    }));

    setInputMessage('');
    dispatch(setProcessing(true));

    // Simulate AI processing
    setTimeout(async () => {
      const aiResponse = generateAIResponse(messageText);
      
      // Add AI response
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      }));

      // Speak AI response
      try {
        await voiceService.speak(aiResponse, currentLanguage);
      } catch (error) {
        console.error('AI response speech failed:', error);
      }

      dispatch(setProcessing(false));
    }, 2000);
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('soil') || lowerMessage.includes('ph') || lowerMessage.includes('nutrient')) {
      return "Based on your soil analysis, I recommend testing the pH levels and ensuring adequate nitrogen content. Consider adding organic compost to improve soil structure and fertility.";
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
      return "For your current soil conditions and climate, I suggest considering crops like wheat, rice, or legumes. These crops are well-suited for your region and have good market demand.";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
      return "Proper irrigation is crucial for crop health. I recommend early morning watering to reduce evaporation and prevent fungal diseases. Monitor soil moisture levels regularly.";
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('bug')) {
      return "For pest management, use integrated pest management (IPM) techniques. Regularly inspect your crops, use beneficial insects, and apply organic pesticides when necessary.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
      return "Current market prices show good demand for seasonal vegetables. I recommend checking local mandi prices regularly and consider value-added processing for better returns.";
    }
    
    return "Thank you for your question. Based on current farming best practices, I recommend consulting with local agricultural experts and monitoring weather conditions for optimal results. Feel free to ask more specific questions about soil, crops, or farming techniques.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('ai.title')}</h1>
            <p className="text-muted-foreground">Ask questions about farming, crops, and agriculture</p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {chatHistory.length === 0 && (
            <Card className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Ask me anything about farming, soil health, crop recommendations, or market prices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                <Button 
                  variant="outline" 
                  onClick={() => handleSendMessage("What crops should I plant this season?")}
                >
                  Crop recommendations
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSendMessage("How can I improve my soil health?")}
                >
                  Soil health tips
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSendMessage("When should I water my crops?")}
                >
                  Irrigation advice
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSendMessage("How to prevent pest attacks?")}
                >
                  Pest management
                </Button>
              </div>
            </Card>
          )}

          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <Card className={`p-4 ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="p-4 bg-secondary text-secondary-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="ml-2 text-sm">{t('ai.processing')}</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai.typeMessage')}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceInput}
              disabled={isListening || isProcessing}
              variant="outline"
              size="icon"
              className={isListening ? 'bg-primary text-primary-foreground' : ''}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {isListening && (
            <p className="text-sm text-center text-primary mt-2 animate-pulse">
              {t('ai.listening')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskAI;