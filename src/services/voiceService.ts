import { Language } from '../store/slices/languageSlice';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

class VoiceService {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
    }

    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.voices = this.synthesis!.getVoices();
      });
    }
  }

  private getVoiceForLanguage(language: Language): SpeechSynthesisVoice | null {
    const languageMap: Record<Language, string[]> = {
      en: ['en-US', 'en-GB', 'en'],
      hi: ['hi-IN', 'hi'],
      mr: ['mr-IN', 'mr'],
      ta: ['ta-IN', 'ta'],
    };

    const preferredLangs = languageMap[language];
    
    for (const lang of preferredLangs) {
      const voice = this.voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }

    return this.voices[0] || null;
  }

  speak(text: string, language: Language): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getVoiceForLanguage(language);
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  listen(language: Language): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const languageMap: Record<Language, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        mr: 'mr-IN',
        ta: 'ta-IN',
      };

      this.recognition.lang = languageMap[language];
      
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        resolve(result);
      };

      this.recognition.onerror = (error) => {
        reject(error);
      };

      this.recognition.start();
    });
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isSupported() {
    return 'speechSynthesis' in window && 'webkitSpeechRecognition' in window;
  }
}

export const voiceService = new VoiceService();