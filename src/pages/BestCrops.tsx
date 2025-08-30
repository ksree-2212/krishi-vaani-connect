import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RootState } from '@/store';
import { setCropSuggestions } from '@/store/slices/cropSlice';
import { offlineService } from '@/services/offlineService';
import { voiceService } from '@/services/voiceService';
import { ArrowLeft, Sprout, TrendingUp, Droplets, Calendar, Volume2 } from 'lucide-react';

const BestCrops = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { suggestions } = useSelector((state: RootState) => state.crop);

  useEffect(() => {
    const loadCropSuggestions = async () => {
      let data = await offlineService.getData('crop_suggestions');
      if (!data) {
        data = offlineService.getMockCropSuggestions();
      }
      dispatch(setCropSuggestions(data));
    };

    const speakTitle = async () => {
      await voiceService.speak(t('crops.title'), currentLanguage);
    };

    loadCropSuggestions();
    speakTitle();
  }, [dispatch, t, currentLanguage]);

  const speakCropInfo = async (crop: any) => {
    const info = `${crop.name}. Suitability ${crop.suitability} percent. ${crop.season} season. Growth period ${crop.growthPeriod} days.`;
    await voiceService.speak(info, currentLanguage);
  };

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'text-success';
    if (suitability >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProfitabilityColor = (profitability: number) => {
    if (profitability >= 75) return 'bg-success';
    if (profitability >= 50) return 'bg-warning';
    return 'bg-destructive';
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
            <h1 className="text-2xl font-bold text-foreground">{t('crops.title')}</h1>
            <p className="text-muted-foreground">AI-powered crop recommendations for your farm</p>
          </div>
        </div>

        {/* Crop Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((crop) => (
            <Card key={crop.id} className="p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crop/20 rounded-lg">
                    <Sprout className="h-6 w-6 text-crop" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{crop.name}</h3>
                    <Badge variant="secondary" className="text-xs">{crop.category}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speakCropInfo(crop)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Suitability */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t('crops.suitability')}</span>
                    <span className={`text-sm font-semibold ${getSuitabilityColor(crop.suitability)}`}>
                      {crop.suitability}%
                    </span>
                  </div>
                  <Progress value={crop.suitability} className="h-2" />
                </div>

                {/* Season */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {t('crops.season')}
                  </span>
                  <Badge variant="outline">{crop.season}</Badge>
                </div>

                {/* Growth Period */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('crops.growthPeriod')}</span>
                  <span className="text-sm font-medium">{crop.growthPeriod} days</span>
                </div>

                {/* Water Requirement */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Droplets className="h-4 w-4" />
                    {t('crops.waterRequirement')}
                  </span>
                  <Badge variant={crop.waterRequirement === 'High' ? 'destructive' : 
                                  crop.waterRequirement === 'Medium' ? 'secondary' : 'default'}>
                    {crop.waterRequirement}
                  </Badge>
                </div>

                {/* Expected Yield */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('crops.expectedYield')}</span>
                  <span className="text-sm font-medium">{crop.expectedYield}</span>
                </div>

                {/* Profitability */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {t('crops.profitability')}
                    </span>
                    <span className="text-sm font-semibold">{crop.profitability}%</span>
                  </div>
                  <Progress 
                    value={crop.profitability} 
                    className={`h-2 ${getProfitabilityColor(crop.profitability)}`}
                  />
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="mt-8 p-6 bg-gradient-primary text-white">
          <h2 className="text-xl font-semibold mb-4">Recommendation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {suggestions.filter(c => c.suitability >= 80).length}
              </div>
              <div className="text-sm opacity-90">Highly Suitable Crops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {suggestions.reduce((acc, c) => Math.max(acc, c.profitability), 0)}%
              </div>
              <div className="text-sm opacity-90">Best Profitability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.min(...suggestions.map(c => c.growthPeriod))}
              </div>
              <div className="text-sm opacity-90">Shortest Growth Period (days)</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BestCrops;