import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import './i18n';

import LanguageSelection from "./pages/LanguageSelection";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MySoil from "./pages/MySoil";
import BestCrops from "./pages/BestCrops";
import MarketPrices from "./pages/MarketPrices";
import SmartGuidance from "./pages/SmartGuidance";
import AskAI from "./pages/AskAI";
import MyFarm from "./pages/MyFarm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-soil" element={<MySoil />} />
            <Route path="/best-crops" element={<BestCrops />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/smart-guidance" element={<SmartGuidance />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/my-farm" element={<MyFarm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
