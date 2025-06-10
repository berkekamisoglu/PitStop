import axiosInstance from './axiosInstance';

export interface UserFavorite {
    id: number;
    tireShop: {
        id: number;
        shopName: string;
        email: string;
        phone: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        openingHour: string;
        closingHour: string;
    };
}

const getUserFavorites = async (): Promise<UserFavorite[]> => {
    const response = await axiosInstance.get<UserFavorite[]>('/api/favorites');
    return response.data;
};

const addToFavorites = async (tireShopId: number): Promise<UserFavorite> => {
    const response = await axiosInstance.post<UserFavorite>(`/api/favorites/${tireShopId}`);
    return response.data;
};

const removeFromFavorites = async (tireShopId: number): Promise<void> => {
    await axiosInstance.delete(`/api/favorites/${tireShopId}`);
};

const toggleFavorite = async (tireShopId: number): Promise<boolean> => {
    const response = await axiosInstance.post<{ isFavorite: boolean }>(`/api/favorites/${tireShopId}/toggle`);
    return response.data.isFavorite;
};

const getFavoriteStatus = async (tireShopId: number): Promise<boolean> => {
    const response = await axiosInstance.get<{ isFavorite: boolean }>(`/api/favorites/${tireShopId}/status`);
    return response.data.isFavorite;
};

export default {
    getUserFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoriteStatus
}; 