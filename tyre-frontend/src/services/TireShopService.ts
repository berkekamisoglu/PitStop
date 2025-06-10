import axiosInstance from './axiosInstance';

export interface TireShopInfo {
  id: number;
  shopName: string;
  email: string;
  phone: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  openingHour: string;
  closingHour: string;
}

const getTireShopInfo = async (shopId: string): Promise<TireShopInfo> => {
  const response = await axiosInstance.get<TireShopInfo>(`/api/tireshops/${shopId}`);
  return response.data;
};

const getAllTireShops = async (): Promise<TireShopInfo[]> => {
  const response = await axiosInstance.get<TireShopInfo[]>('/api/tireshops');
  return response.data;
};

const getNearbyTireShops = async (latitude: number, longitude: number, radiusKm: number = 50): Promise<TireShopInfo[]> => {
  try {
    console.log('🌐 TireShopService: Fetching nearby shops for coordinates:', { latitude, longitude, radiusKm });
    
    // İlk olarak yakındaki dükkanları ara
    const nearbyResponse = await axiosInstance.get<TireShopInfo[]>('/api/tireshops', {
      params: { latitude, longitude, radiusKm }
    });
    console.log('📡 API Response for nearby:', nearbyResponse.data);
    
    if (nearbyResponse.data.length > 0) {
      return nearbyResponse.data;
    }
    
    // Eğer yakında dükkan yoksa tüm dükkanları getir
    console.log('🔄 No nearby shops found, fetching all shops...');
    const allResponse = await axiosInstance.get<TireShopInfo[]>('/api/tireshops');
    console.log('📡 API Response for all shops:', allResponse.data);
    
    return allResponse.data;
  } catch (error) {
    console.error('❌ Error in getNearbyTireShops:', error);
    
    // Hata durumunda tüm dükkanları getirmeye çalış
    try {
      const fallbackResponse = await axiosInstance.get<TireShopInfo[]>('/api/tireshops');
      console.log('🔄 Fallback: Got all shops:', fallbackResponse.data);
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      return [];
    }
  }
};

const updateShopCoordinates = async (shopId: string, latitude: number, longitude: number): Promise<TireShopInfo> => {
  const response = await axiosInstance.put<TireShopInfo>(`/api/tireshops/${shopId}/coordinates`, null, {
    params: { latitude, longitude }
  });
  return response.data;
};

export default {
  getTireShopInfo,
  getAllTireShops,
  getNearbyTireShops,
  updateShopCoordinates
}; 