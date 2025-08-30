import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  market: string;
  date: string;
}

interface MarketState {
  prices: MarketPrice[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  prices: [],
  isLoading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarketPrices: (state, action: PayloadAction<MarketPrice[]>) => {
      state.prices = action.payload;
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

export const { setMarketPrices, setLoading, setError } = marketSlice.actions;
export default marketSlice.reducer;