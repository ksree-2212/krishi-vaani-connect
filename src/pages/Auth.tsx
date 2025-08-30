import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RootState } from '@/store';
import { setAuthenticated, setUser } from '@/store/slices/authSlice';
import { voiceService } from '@/services/voiceService';
import { Sprout, Phone, Shield, User, MapPin } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state: RootState) => state.language);
  
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(async () => {
      setIsLoading(false);
      setStep('otp');
      await voiceService.speak(t('auth.otp'), currentLanguage);
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 4) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(async () => {
      setIsLoading(false);
      setStep('profile');
      await voiceService.speak(t('auth.createProfile'), currentLanguage);
    }, 1500);
  };

  const handleProfileSubmit = async () => {
    if (!name || !location) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(setUser({ phone, name, location }));
      dispatch(setAuthenticated(true));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-nature flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm shadow-depth">
        <div className="text-center mb-8">
          <Sprout className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.login')}</h1>
          <p className="text-muted-foreground">{t('auth.welcome')}</p>
        </div>

        {step === 'phone' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('auth.phone')}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 12345 67890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              onClick={handlePhoneSubmit}
              disabled={phone.length < 10 || isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('auth.otp')}
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            <Button 
              onClick={handleOtpSubmit}
              disabled={otp.length < 4 || isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Verifying...' : t('auth.verify')}
            </Button>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('auth.name')}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('auth.location')}
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              onClick={handleProfileSubmit}
              disabled={!name || !location || isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Creating...' : 'Complete Setup'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth;