import { get, set, del, keys } from 'idb-keyval';

class OfflineService {
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async storeData(key: string, data: any) {
    try {
      await set(key, { data, timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  async getData(key: string) {
    try {
      const stored = await get(key);
      return stored?.data || null;
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  }

  async removeData(key: string) {
    try {
      await del(key);
    } catch (error) {
      console.error('Failed to remove offline data:', error);
    }
  }

  async getAllKeys() {
    try {
      return await keys();
    } catch (error) {
      console.error('Failed to get offline keys:', error);
      return [];
    }
  }

  async syncData() {
    if (!this.isOnline) return;

    try {
      const allKeys = await this.getAllKeys();
      const pendingKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith('pending_')
      );

      for (const key of pendingKeys) {
        const keyStr = key as string;
        const data = await this.getData(keyStr);
        if (data) {
          // Implement actual sync logic here
          console.log('Syncing data:', keyStr, data);
          await this.removeData(keyStr);
        }
      }
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  }

  getOnlineStatus() {
    return this.isOnline;
  }

  // Mock data for offline use
  getMockSoilData() {
    return {
      ph: 6.5,
      nitrogen: 75,
      phosphorus: 45,
      potassium: 80,
      organicMatter: 3.2,
      moisture: 65,
      temperature: 24,
      lastUpdated: new Date().toISOString(),
    };
  }

  getMockCropSuggestions() {
    return [
      {
        id: '1',
        name: 'Wheat',
        category: 'Cereal',
        suitability: 85,
        season: 'Rabi',
        growthPeriod: 120,
        waterRequirement: 'Medium',
        expectedYield: '3-4 tons/hectare',
        profitability: 78,
      },
      {
        id: '2',
        name: 'Rice',
        category: 'Cereal',
        suitability: 92,
        season: 'Kharif',
        growthPeriod: 100,
        waterRequirement: 'High',
        expectedYield: '4-5 tons/hectare',
        profitability: 82,
      },
    ];
  }

  getMockMarketPrices() {
    return [
      {
        crop: 'Wheat',
        price: 2150,
        unit: 'quintal',
        change: 2.5,
        market: 'Local Mandi',
        date: new Date().toISOString(),
      },
      {
        crop: 'Rice',
        price: 1850,
        unit: 'quintal',
        change: -1.2,
        market: 'Regional Market',
        date: new Date().toISOString(),
      },
    ];
  }

  getMockGuidanceTips() {
    return [
      {
        id: '1',
        title: 'Irrigation Schedule',
        content: 'Water your crops early morning for better absorption',
        category: 'Water Management',
        priority: 'high' as const,
        date: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Pest Control',
        content: 'Check for early signs of pest infestation',
        category: 'Crop Protection',
        priority: 'medium' as const,
        date: new Date().toISOString(),
      },
    ];
  }
}

export const offlineService = new OfflineService();