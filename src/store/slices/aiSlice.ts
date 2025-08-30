import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface AIState {
  chatHistory: ChatMessage[];
  isListening: boolean;
  isProcessing: boolean;
  lastResponse: string | null;
}

const initialState: AIState = {
  chatHistory: [],
  isListening: false,
  isProcessing: false,
  lastResponse: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setLastResponse: (state, action: PayloadAction<string>) => {
      state.lastResponse = action.payload;
    },
    clearChat: (state) => {
      state.chatHistory = [];
    },
  },
});

export const { addMessage, setListening, setProcessing, setLastResponse, clearChat } = aiSlice.actions;
export default aiSlice.reducer;