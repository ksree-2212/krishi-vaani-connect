import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GuidanceTip {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

interface GuidanceState {
  tips: GuidanceTip[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GuidanceState = {
  tips: [],
  isLoading: false,
  error: null,
};

const guidanceSlice = createSlice({
  name: 'guidance',
  initialState,
  reducers: {
    setGuidanceTips: (state, action: PayloadAction<GuidanceTip[]>) => {
      state.tips = action.payload;
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

export const { setGuidanceTips, setLoading, setError } = guidanceSlice.actions;
export default guidanceSlice.reducer;