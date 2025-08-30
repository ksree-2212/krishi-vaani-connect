import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store';
import { offlineService } from '@/services/offlineService';
import { voiceService } from '@/services/voiceService';
import { 
  Sprout, 
  TrendingUp, 
  DollarSign, 
  Lightbulb, 
  MessageCircle, 
  BarChart3,
  TestTube,
  Wifi,
  WifiOff,
  MapPin,
  User
} from 'lucide-react';
import dashboardPattern from '@/assets/dashboard-pattern.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const [isOnline, setIsOnline] = useState(offlineService.getOnlineStatus());

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Welcome speech
    const speakWelcome = async () => {
      try {
        await voiceService.speak(`${t('dashboard.title')}. ${t('dashboard.subtitle')}`, currentLanguage);
      } catch (error) {
        console.error('Dashboard welcome speech failed:', error);
      }
    };

    speakWelcome();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [t, currentLanguage]);

  const dashboardItems = [
    {
      title: t('dashboard.mySoil'),
      icon: TestTube,
      path: '/my-soil',
      color: 'bg-soil',
      description: 'Test and analyze your soil composition'
    },
    {
      title: t('dashboard.bestCrops'),
      icon: Sprout,
      path: '/best-crops',
      color: 'bg-crop',
      description: 'Get AI-powered crop recommendations'
    },
    {
      title: t('dashboard.marketPrices'),
      icon: DollarSign,
      path: '/market-prices',
      color: 'bg-harvest',
      description: 'Check current market rates'
    },
    {
      title: t('dashboard.smartGuidance'),
      icon: Lightbulb,
      path: '/smart-guidance',
      color: 'bg-primary',
      description: 'Daily tips and guidance'
    },
    {
      title: t('dashboard.askAI'),
      icon: MessageCircle,
      path: '/ask-ai',
      color: 'bg-accent',
      description: 'Voice-powered AI assistant'
    },
    {
      title: t('dashboard.myFarm'),
      icon: BarChart3,
      path: '/my-farm',
      color: 'bg-secondary',
      description: 'Overview of your farm insights'
    },
  ];

  const handleCardClick = async (item: typeof dashboardItems[0]) => {
    try {
      await voiceService.speak(item.title, currentLanguage);
    } catch (error) {
      console.error('Card click speech failed:', error);
    }
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${dashboardPattern})` }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4 shadow-soft">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-semibold">{user?.name || 'Farmer'}</h1>
                <div className="flex items-center gap-1 text-primary-foreground/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{user?.location || 'Location'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={isOnline ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOnline ? 'Online' : t('dashboard.offlineMode')}
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h2>
            <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <Card
                key={index}
                className="p-6 cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 group"
                onClick={() => handleCardClick(item)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${item.color} text-white group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-primary text-white">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Farm Health</h3>
              <p className="text-2xl font-bold">85%</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-earth text-white">
              <Sprout className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Active Crops</h3>
              <p className="text-2xl font-bold">3</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-nature text-white">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Revenue This Month</h3>
              <p className="text-2xl font-bold">₹45,230</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;