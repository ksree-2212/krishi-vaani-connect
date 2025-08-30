import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RootState } from '@/store';
import { setSoilData } from '@/store/slices/soilSlice';
import { offlineService } from '@/services/offlineService';
import { voiceService } from '@/services/voiceService';
import { ArrowLeft, TestTube, Mic, FileText } from 'lucide-react';

const MySoil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  const { data: soilData, isLoading } = useSelector((state: RootState) => state.soil);
  
  const [inputMethod, setInputMethod] = useState<'manual' | 'voice'>('manual');
  const [formData, setFormData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: '',
    temperature: ''
  });

  useEffect(() => {
    // Load existing soil data or mock data for offline
    const loadSoilData = async () => {
      let data = await offlineService.getData('soil_data');
      if (!data) {
        data = offlineService.getMockSoilData();
      }
      dispatch(setSoilData(data));
    };

    const speakTitle = async () => {
      await voiceService.speak(t('soil.title'), currentLanguage);
    };

    loadSoilData();
    speakTitle();
  }, [dispatch, t, currentLanguage]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceInput = async () => {
    try {
      const instruction = "Please tell me the pH level, nitrogen, phosphorus, and potassium values";
      await voiceService.speak(instruction, currentLanguage);
      
      // Simulate voice input processing
      setTimeout(async () => {
        const mockData = {
          ph: '6.5',
          nitrogen: '75',
          phosphorus: '45',
          potassium: '80',
          organicMatter: '3.2',
          moisture: '65',
          temperature: '24'
        };
        setFormData(mockData);
        await voiceService.speak("Data captured successfully", currentLanguage);
      }, 3000);
    } catch (error) {
      console.error('Voice input failed:', error);
    }
  };

  const handleSubmit = async () => {
    const soilData = {
      ph: parseFloat(formData.ph),
      nitrogen: parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium: parseFloat(formData.potassium),
      organicMatter: parseFloat(formData.organicMatter),
      moisture: parseFloat(formData.moisture),
      temperature: parseFloat(formData.temperature),
      lastUpdated: new Date().toISOString()
    };

    dispatch(setSoilData(soilData));
    await offlineService.storeData('soil_data', soilData);
    await voiceService.speak("Soil analysis completed", currentLanguage);
  };

  const getQualityColor = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return 'text-success';
    return 'text-warning';
  };

  const getQualityProgress = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
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
            <h1 className="text-2xl font-bold text-foreground">{t('soil.title')}</h1>
            <p className="text-muted-foreground">Test and analyze your soil composition</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              {t('soil.testSoil')}
            </h2>

            <div className="flex gap-2 mb-6">
              <Button
                variant={inputMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setInputMethod('manual')}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('soil.enterData')}
              </Button>
              <Button
                variant={inputMethod === 'voice' ? 'default' : 'outline'}
                onClick={() => setInputMethod('voice')}
                className="flex-1"
              >
                <Mic className="h-4 w-4 mr-2" />
                {t('soil.voiceInput')}
              </Button>
            </div>

            {inputMethod === 'manual' ? (
              <div className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{t(`soil.${key}`)}</Label>
                    <Input
                      id={key}
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                ))}
                <Button onClick={handleSubmit} className="w-full">
                  {t('soil.generateReport')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mic className="h-16 w-16 text-primary mx-auto mb-4" />
                <Button onClick={handleVoiceInput} size="lg">
                  Start Voice Input
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Tap to speak your soil test values
                </p>
              </div>
            )}
          </Card>

          {/* Results Section */}
          {soilData && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Soil Analysis Report</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('soil.ph')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.ph, [6.0, 7.5])}`}>
                      {soilData.ph}
                    </span>
                    <Progress value={getQualityProgress(soilData.ph, 14)} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.nitrogen')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.nitrogen, [60, 100])}`}>
                      {soilData.nitrogen}%
                    </span>
                    <Progress value={soilData.nitrogen} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.phosphorus')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.phosphorus, [30, 60])}`}>
                      {soilData.phosphorus}%
                    </span>
                    <Progress value={soilData.phosphorus} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.potassium')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.potassium, [70, 100])}`}>
                      {soilData.potassium}%
                    </span>
                    <Progress value={soilData.potassium} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.organicMatter')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.organicMatter, [2.0, 5.0])}`}>
                      {soilData.organicMatter}%
                    </span>
                    <Progress value={getQualityProgress(soilData.organicMatter, 10)} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.moisture')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.moisture, [50, 80])}`}>
                      {soilData.moisture}%
                    </span>
                    <Progress value={soilData.moisture} className="w-20 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('soil.temperature')}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getQualityColor(soilData.temperature, [20, 30])}`}>
                      {soilData.temperature}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Overall Soil Health</h3>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="flex-1" />
                  <span className="text-success font-semibold">85%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your soil is in good condition. Consider adding organic matter to improve fertility.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySoil;