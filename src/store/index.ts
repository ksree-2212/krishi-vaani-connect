import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import soilSlice from './slices/soilSlice';
import cropSlice from './slices/cropSlice';
import marketSlice from './slices/marketSlice';
import guidanceSlice from './slices/guidanceSlice';
import aiSlice from './slices/aiSlice';
import farmSlice from './slices/farmSlice';
import languageSlice from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    soil: soilSlice,
    crop: cropSlice,
    market: marketSlice,
    guidance: guidanceSlice,
    ai: aiSlice,
    farm: farmSlice,
    language: languageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;