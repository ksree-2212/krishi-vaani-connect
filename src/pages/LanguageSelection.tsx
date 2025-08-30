import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { setLanguage, Language } from '@/store/slices/languageSlice';
import { voiceService } from '@/services/voiceService';
import { Sprout, Volume2 } from 'lucide-react';
import heroImage from '@/assets/hero-agriculture.jpg';

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
];

const LanguageSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const handleLanguageSelect = async (lang: Language) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    
    // Voice preview with delay to ensure language is loaded
    setTimeout(async () => {
      try {
        await voiceService.speak(t('voice.voicePreview'), lang);
      } catch (error) {
        console.error('Voice preview failed:', error);
      }
    }, 100);
  };

  const handleContinue = () => {
    navigate('/welcome');
  };

  const playVoicePreview = async (lang: Language) => {
    try {
      await voiceService.speak(t('voice.tapToChoose'), lang);
    } catch (error) {
      console.error('Voice preview failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sprout className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Smart Agriculture</h1>
          <p className="text-lg text-primary/80">AI-powered farming insights</p>
        </div>

        <Card className="w-full max-w-md p-6 bg-card/95 backdrop-blur-sm shadow-depth">
          <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
            {t('welcome.chooseLanguage')}
          </h2>
          
          <div className="space-y-3">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "outline"}
                className="w-full h-14 text-left justify-between group"
                onClick={() => handleLanguageSelect(language.code)}
              >
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm opacity-70">{language.name}</div>
                </div>
                <Volume2 
                  className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    playVoicePreview(language.code);
                  }}
                />
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleContinue}
            className="w-full mt-6 h-12 bg-primary hover:bg-primary/90"
            disabled={!selectedLanguage}
          >
            {t('welcome.continue')}
          </Button>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-primary/60">
            Tap any language button to hear a voice preview
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;