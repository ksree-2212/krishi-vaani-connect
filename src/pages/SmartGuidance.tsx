import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store';
import { setGuidanceTips } from '@/store/slices/guidanceSlice';
import { offlineService } from '@/services/offlineService';
import { voiceService } from '@/services/voiceService';
import { ArrowLeft, Lightbulb, AlertTriangle, Info, CheckCircle, Volume2, Calendar } from 'lucide-react';

const SmartGuidance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { tips } = useSelector((state: RootState) => state.guidance);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const loadGuidanceTips = async () => {
      let data = await offlineService.getData('guidance_tips');
      if (!data) {
        data = offlineService.getMockGuidanceTips();
      }
      dispatch(setGuidanceTips(data));
    };

    const speakTitle = async () => {
      await voiceService.speak(t('guidance.title'), currentLanguage);
    };

    loadGuidanceTips();
    speakTitle();
  }, [dispatch, t, currentLanguage]);

  const filteredTips = selectedPriority === 'all' 
    ? tips 
    : tips.filter(tip => tip.priority === selectedPriority);

  const speakTip = async (tip: any) => {
    const info = `${tip.title}. ${tip.content}`;
    await voiceService.speak(info, currentLanguage);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Info;
      case 'low':
        return CheckCircle;
      default:
        return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-destructive bg-destructive/10';
      case 'medium':
        return 'border-warning bg-warning/10';
      case 'low':
        return 'border-success bg-success/10';
      default:
        return 'border-border';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'secondary' as const;
      case 'low':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-foreground">{t('guidance.title')}</h1>
            <p className="text-muted-foreground">Daily tips and actionable insights for your farm</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={selectedPriority === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedPriority('all')}
          >
            All Tips
          </Button>
          <Button
            variant={selectedPriority === 'high' ? 'default' : 'outline'}
            onClick={() => setSelectedPriority('high')}
            className="whitespace-nowrap"
          >
            {t('guidance.highPriority')}
          </Button>
          <Button
            variant={selectedPriority === 'medium' ? 'default' : 'outline'}
            onClick={() => setSelectedPriority('medium')}
            className="whitespace-nowrap"
          >
            {t('guidance.mediumPriority')}
          </Button>
          <Button
            variant={selectedPriority === 'low' ? 'default' : 'outline'}
            onClick={() => setSelectedPriority('low')}
            className="whitespace-nowrap"
          >
            {t('guidance.lowPriority')}
          </Button>
        </div>

        {/* Guidance Tips */}
        <div className="space-y-4">
          {filteredTips.map((tip) => {
            const PriorityIcon = getPriorityIcon(tip.priority);
            
            return (
              <Card 
                key={tip.id} 
                className={`p-6 ${getPriorityColor(tip.priority)} hover:shadow-glow transition-all duration-300 cursor-pointer`}
                onClick={() => speakTip(tip)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PriorityIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{tip.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getPriorityBadgeVariant(tip.priority)}>
                          {tip.priority.charAt(0).toUpperCase() + tip.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakTip(tip);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-foreground leading-relaxed mb-4">{tip.content}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(tip.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredTips.length === 0 && (
          <Card className="p-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No tips available</h3>
            <p className="text-muted-foreground">Check back later for new guidance and recommendations.</p>
          </Card>
        )}

        {/* Daily Summary */}
        <Card className="mt-8 p-6 bg-gradient-primary text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            {t('guidance.dailyTips')} Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tips.filter(t => t.priority === 'high').length}
              </div>
              <div className="text-sm opacity-90">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tips.filter(t => t.priority === 'medium').length}
              </div>
              <div className="text-sm opacity-90">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tips.filter(t => t.priority === 'low').length}
              </div>
              <div className="text-sm opacity-90">Low Priority</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartGuidance;