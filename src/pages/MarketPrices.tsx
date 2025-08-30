import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store';
import { setMarketPrices } from '@/store/slices/marketSlice';
import { offlineService } from '@/services/offlineService';
import { voiceService } from '@/services/voiceService';
import { ArrowLeft, Search, TrendingUp, TrendingDown, DollarSign, MapPin, Mic } from 'lucide-react';

const MarketPrices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { prices } = useSelector((state: RootState) => state.market);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loadMarketPrices = async () => {
      let data = await offlineService.getData('market_prices');
      if (!data) {
        data = offlineService.getMockMarketPrices();
      }
      dispatch(setMarketPrices(data));
    };

    const speakTitle = async () => {
      await voiceService.speak(t('market.title'), currentLanguage);
    };

    loadMarketPrices();
    speakTitle();
  }, [dispatch, t, currentLanguage]);

  const handleVoiceSearch = async () => {
    setIsListening(true);
    try {
      await voiceService.speak('Please tell me which crop price you want to check', currentLanguage);
      const result = await voiceService.listen(currentLanguage);
      setSearchTerm(result);
      await voiceService.speak(`Searching for ${result} prices`, currentLanguage);
    } catch (error) {
      console.error('Voice search failed:', error);
    } finally {
      setIsListening(false);
    }
  };

  const filteredPrices = prices.filter(price =>
    price.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakPrice = async (price: any) => {
    const info = `${price.crop} price is ${price.price} rupees per ${price.unit} at ${price.market}`;
    await voiceService.speak(info, currentLanguage);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('market.title')}</h1>
            <p className="text-muted-foreground">Current market rates and price trends</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('market.searchCrop')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleVoiceSearch}
              disabled={isListening}
              className="flex items-center gap-2"
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice Search'}
            </Button>
          </div>
        </Card>

        {/* Market Prices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPrices.map((price, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer"
              onClick={() => speakPrice(price)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{price.crop}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{price.market}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold text-foreground">₹{price.price}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">per {price.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('market.change')}</span>
                <div className="flex items-center gap-1">
                  {price.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <Badge 
                    variant={price.change > 0 ? "default" : "destructive"}
                    className={price.change > 0 ? "bg-success text-success-foreground" : ""}
                  >
                    {price.change > 0 ? '+' : ''}{price.change}%
                  </Badge>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Updated: {new Date(price.date).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>

        {/* Nearby Markets */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('market.nearbyMarkets')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Local Mandi</h3>
              <p className="text-sm text-muted-foreground">2.5 km away</p>
              <p className="text-sm">Open: 6:00 AM - 2:00 PM</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Regional Market</h3>
              <p className="text-sm text-muted-foreground">8.1 km away</p>
              <p className="text-sm">Open: 5:00 AM - 12:00 PM</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">APMC Market</h3>
              <p className="text-sm text-muted-foreground">15.3 km away</p>
              <p className="text-sm">Open: 7:00 AM - 4:00 PM</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Wholesale Hub</h3>
              <p className="text-sm text-muted-foreground">22.7 km away</p>
              <p className="text-sm">Open: 4:00 AM - 10:00 AM</p>
            </div>
          </div>
        </Card>

        {/* Price Trends Summary */}
        <Card className="mt-6 p-6 bg-gradient-earth text-white">
          <h2 className="text-xl font-semibold mb-4">Price Trends Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {prices.filter(p => p.change > 0).length}
              </div>
              <div className="text-sm opacity-90">Crops with Rising Prices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ₹{Math.max(...prices.map(p => p.price))}
              </div>
              <div className="text-sm opacity-90">Highest Price (per quintal)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.max(...prices.map(p => Math.abs(p.change)))}%
              </div>
              <div className="text-sm opacity-90">Biggest Price Movement</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;