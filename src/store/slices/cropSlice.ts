import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Crop {
  id: string;
  name: string;
  category: string;
  suitability: number;
  season: string;
  growthPeriod: number;
  waterRequirement: string;
  expectedYield: string;
  profitability: number;
}

interface CropState {
  suggestions: Crop[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CropState = {
  suggestions: [],
  isLoading: false,
  error: null,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setCropSuggestions: (state, action: PayloadAction<Crop[]>) => {
      state.suggestions = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setCropSuggestions, setLoading, setError } = cropSlice.actions;
export default cropSlice.reducer;