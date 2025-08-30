import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RootState } from '@/store';
import { setFarmInsights, setNextActions } from '@/store/slices/farmSlice';
import { voiceService } from '@/services/voiceService';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Thermometer,
  Droplets,
  DollarSign,
  Calendar,
  MapPin,
  Sprout
} from 'lucide-react';

const MyFarm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { insights, nextActions } = useSelector((state: RootState) => state.farm);

  useEffect(() => {
    const loadFarmData = async () => {
      // Mock farm insights
      const mockInsights = [
        {
          type: 'soil' as const,
          title: 'Soil Health',
          value: '85%',
          status: 'good' as const,
          recommendation: 'Maintain current fertilization schedule'
        },
        {
          type: 'crop' as const,
          title: 'Crop Performance',
          value: '92%',
          status: 'good' as const,
          recommendation: 'Crops are performing well, continue monitoring'
        },
        {
          type: 'market' as const,
          title: 'Market Outlook',
          value: 'Rising',
          status: 'good' as const,
          recommendation: 'Good time to plan harvest and sales'
        },
        {
          type: 'weather' as const,
          title: 'Weather Alert',
          value: 'Rain Expected',
          status: 'warning' as const,
          recommendation: 'Prepare drainage and cover sensitive crops'
        }
      ];

      const mockActions = [
        'Check irrigation system before rainfall',
        'Apply organic fertilizer to wheat fields',
        'Inspect crops for pest activity',
        'Prepare for harvest in 2 weeks',
        'Update soil moisture readings'
      ];

      dispatch(setFarmInsights(mockInsights));
      dispatch(setNextActions(mockActions));
    };

    const speakTitle = async () => {
      await voiceService.speak(t('farm.title'), currentLanguage);
    };

    loadFarmData();
    speakTitle();
  }, [dispatch, t, currentLanguage]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'critical':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'soil':
        return Sprout;
      case 'crop':
        return BarChart3;
      case 'market':
        return DollarSign;
      case 'weather':
        return Thermometer;
      default:
        return BarChart3;
    }
  };

  const speakInsight = async (insight: any) => {
    const info = `${insight.title}: ${insight.value}. ${insight.recommendation}`;
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
            <h1 className="text-2xl font-bold text-foreground">{t('farm.title')}</h1>
            <p className="text-muted-foreground">Comprehensive overview of your farm status</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-primary text-white">
            <div className="flex items-center justify-between mb-2">
              <Sprout className="h-8 w-8" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="font-semibold">Active Crops</h3>
            <p className="text-sm opacity-90">Wheat, Rice, Sugarcane</p>
          </Card>

          <Card className="p-6 bg-gradient-earth text-white">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-8 w-8" />
              <span className="text-2xl font-bold">25</span>
            </div>
            <h3 className="font-semibold">Farm Area</h3>
            <p className="text-sm opacity-90">Acres</p>
          </Card>

          <Card className="p-6 bg-gradient-nature text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8" />
              <span className="text-2xl font-bold">₹45K</span>
            </div>
            <h3 className="font-semibold">Monthly Revenue</h3>
            <p className="text-sm opacity-90">This month</p>
          </Card>

          <Card className="p-6 bg-gradient-sky text-white">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="h-8 w-8" />
              <span className="text-2xl font-bold">65%</span>
            </div>
            <h3 className="font-semibold">Soil Moisture</h3>
            <p className="text-sm opacity-90">Optimal level</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Farm Insights */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              {t('farm.insights')}
            </h2>
            
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const StatusIcon = getStatusIcon(insight.status);
                const InsightIcon = getInsightIcon(insight.type);
                
                return (
                  <Card 
                    key={index}
                    className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300"
                    onClick={() => speakInsight(insight)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <InsightIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-5 w-5 ${getStatusColor(insight.status)}`} />
                            <span className="font-bold">{insight.value}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.recommendation}</p>
                        <Badge 
                          variant={insight.status === 'good' ? 'default' : 
                                  insight.status === 'warning' ? 'secondary' : 'destructive'}
                        >
                          {insight.status.charAt(0).toUpperCase() + insight.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Next Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              {t('farm.nextActions')}
            </h2>
            
            <Card className="p-6">
              <div className="space-y-4">
                {nextActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {index === 0 ? 'Urgent' : index === 1 ? 'Today' : 'This Week'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6 mt-6">
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Crop Yield</span>
                    <span className="text-sm font-semibold">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Resource Efficiency</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-semibold">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Sustainability Score</span>
                    <span className="text-sm font-semibold">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFarm;