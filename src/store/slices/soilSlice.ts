import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
  lastUpdated: string;
}

interface SoilState {
  data: SoilData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SoilState = {
  data: null,
  isLoading: false,
  error: null,
};

const soilSlice = createSlice({
  name: 'soil',
  initialState,
  reducers: {
    setSoilData: (state, action: PayloadAction<SoilData>) => {
      state.data = action.payload;
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

export const { setSoilData, setLoading, setError } = soilSlice.actions;
export default soilSlice.reducer;