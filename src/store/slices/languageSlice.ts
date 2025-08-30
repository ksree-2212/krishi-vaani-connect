import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'hi' | 'te' | 'ta';

interface LanguageState {
  currentLanguage: Language;
  isVoiceEnabled: boolean;
  speechSupported: boolean;
}

const initialState: LanguageState = {
  currentLanguage: 'en',
  isVoiceEnabled: true,
  speechSupported: 'speechSynthesis' in window,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
    },
    setVoiceEnabled: (state, action: PayloadAction<boolean>) => {
      state.isVoiceEnabled = action.payload;
    },
    setSpeechSupported: (state, action: PayloadAction<boolean>) => {
      state.speechSupported = action.payload;
    },
  },
});

export const { setLanguage, setVoiceEnabled, setSpeechSupported } = languageSlice.actions;
export default languageSlice.reducer;