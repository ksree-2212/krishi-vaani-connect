import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FarmInsight {
  type: 'soil' | 'crop' | 'market' | 'weather';
  title: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  recommendation: string;
}

interface FarmState {
  insights: FarmInsight[];
  nextActions: string[];
  isLoading: boolean;
}

const initialState: FarmState = {
  insights: [],
  nextActions: [],
  isLoading: false,
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    setFarmInsights: (state, action: PayloadAction<FarmInsight[]>) => {
      state.insights = action.payload;
    },
    setNextActions: (state, action: PayloadAction<string[]>) => {
      state.nextActions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFarmInsights, setNextActions, setLoading } = farmSlice.actions;
export default farmSlice.reducer;