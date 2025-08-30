import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RootState } from '@/store';
import { voiceService } from '@/services/voiceService';
import { Sprout, Users, TrendingUp, Smartphone } from 'lucide-react';
import heroImage from '@/assets/hero-agriculture.jpg';

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);

  useEffect(() => {
    const speakWelcome = async () => {
      try {
        await voiceService.speak(t('welcome.title'), currentLanguage);
        setTimeout(async () => {
          await voiceService.speak(t('welcome.subtitle'), currentLanguage);
        }, 2000);
      } catch (error) {
        console.error('Welcome speech failed:', error);
      }
    };

    speakWelcome();
  }, [t, currentLanguage]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sprout className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{t('welcome.title')}</h1>
          <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
            {t('welcome.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <Users className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">For Every Farmer</h3>
            <p className="text-white/80 text-sm">Designed for farmers of all experience levels</p>
          </Card>
          
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <TrendingUp className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-white/80 text-sm">Get intelligent recommendations for your crops</p>
          </Card>
          
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <Smartphone className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Voice-First</h3>
            <p className="text-white/80 text-sm">Use your voice in your preferred language</p>
          </Card>
        </div>

        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-glow"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;