import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Trash2, Heart } from 'lucide-react';
import favoriteService, { UserFavorite } from '../../services/FavoriteService';

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<UserFavorite[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const favoritesList = await favoriteService.getUserFavorites();
            setFavorites(favoritesList);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (shopId: number) => {
        try {
            await favoriteService.removeFromFavorites(shopId);
            setFavorites(prev => prev.filter(fav => fav.tireShop.id !== shopId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                <h1 className="text-2xl font-bold text-white">Favorilerim</h1>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Star className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Henüz favori lastikçiniz yok</h3>
                        <p className="text-gray-400 mb-6">Haritadan lastikçileri favorilere ekleyerek başlayın</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center"
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            Haritaya Git
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {favorite.tireShop.shopName}
                                </h3>
                                <div className="flex space-x-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                    <button
                                        onClick={() => handleRemoveFavorite(favorite.tireShop.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Favorilerden çıkar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                    <span className="text-sm text-gray-300">{favorite.tireShop.address}</span>
                                </div>
                                
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-blue-500 mr-2" />
                                    <span className="text-sm text-gray-300">{favorite.tireShop.phone}</span>
                                </div>
                                
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-300">
                                        {favorite.tireShop.openingHour} - {favorite.tireShop.closingHour}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button
                                    onClick={() => navigate(`/shops/${favorite.tireShop.id}`)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Detayları Gör
                                </button>
                                {favorite.tireShop.latitude && favorite.tireShop.longitude && (
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        title="Haritada göster"
                                    >
                                        <MapPin className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage; 
