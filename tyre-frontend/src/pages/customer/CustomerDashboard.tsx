import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { Car, Clock, Star, Calendar, Phone, Wrench } from 'lucide-react';
import tireShopService, { TireShopInfo } from '../../services/TireShopService';
import axiosInstance from '../../services/axiosInstance';
import favoriteService from '../../services/FavoriteService';

import '../map-styles.css';

const userIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
        background-color: #3B82F6;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: center bottom;
    ">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
    </div>`,
    iconSize: [70, 70],
    iconAnchor: [35, 70],
    popupAnchor: [0, -70]
});

const shopIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
        background-color: #EF4444;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: center bottom;
    ">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
        </svg>
    </div>`,
    iconSize: [70, 70],
    iconAnchor: [35, 70],
    popupAnchor: [0, -70]
});

const CustomerDashboard: React.FC = () => {
    const [userLocation, setUserLocation] = useState<LatLngTuple>([39.9334, 32.8597]);
    const [shops, setShops] = useState<TireShopInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        activeAppointments: 0,
        registeredVehicles: 0,
        favoriteShops: 0,
        serviceHistory: 0
    });
    const [favoriteStatuses, setFavoriteStatuses] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate();

    useEffect(() => {
        loadUserStats();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(location);
                    fetchNearbyShops(location);
                },
                () => fetchNearbyShops(userLocation)
            );
        } else {
            fetchNearbyShops(userLocation);
        }
    }, []);

    const loadUserStats = async () => {
        try {
            const vehiclesResponse = await axiosInstance.get('/api/user-vehicles');
            const vehicles = vehiclesResponse.data || [];

            const appointmentsResponse = await axiosInstance.get('/api/appointments');
            const appointments = appointmentsResponse.data || [];

            const activeAppointments = appointments.filter((apt: any) =>
                ['PENDING', 'CONFIRMED'].includes(apt.status)
            ).length;

            const completedAppointments = appointments.filter((apt: any) => apt.status === 'COMPLETED').length;

            const favoriteShopsCount = Math.min(shops.length, 5);

            setStats({
                activeAppointments,
                registeredVehicles: vehicles.length,
                favoriteShops: favoriteShopsCount,
                serviceHistory: completedAppointments
            });
        } catch (error) {
            console.error("Error loading user stats:", error);
        }
    };

    const loadFavoriteStatuses = async (shops: TireShopInfo[]) => {
        try {
            const statuses = await Promise.all(shops.map(async shop => {
                try {
                    const isFavorite = await favoriteService.getFavoriteStatus(shop.id);
                    return { id: shop.id, isFavorite };
                } catch {
                    return { id: shop.id, isFavorite: false };
                }
            }));

            const statusMap = statuses.reduce((acc, cur) => {
                acc[cur.id] = cur.isFavorite;
                return acc;
            }, {} as { [key: number]: boolean });

            setFavoriteStatuses(statusMap);
        } catch (error) {
            console.error("Error loading favorite statuses:", error);
        }
    };

    const handleToggleFavorite = async (shopId: number) => {
        try {
            const newStatus = await favoriteService.toggleFavorite(shopId);
            setFavoriteStatuses(prev => ({ ...prev, [shopId]: newStatus }));
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const fetchNearbyShops = async (location: LatLngTuple) => {
        try {
            console.log('🔍 Fetching shops for location:', location);
            const response = await tireShopService.getNearbyTireShops(location[0], location[1]);
            console.log('📍 Total shops received:', response.length);
            console.log('🏪 Shops data:', response);
            
            const shopsWithCoordinates = response.filter(shop => shop.latitude && shop.longitude);
            console.log('📌 Shops with coordinates:', shopsWithCoordinates.length);
            console.log('🗺️ Valid shops for map:', shopsWithCoordinates);
            
            setShops(response);
            await loadFavoriteStatuses(response);
            setStats(prev => ({ ...prev, favoriteShops: Math.min(response.length, 5) }));
        } catch (error) {
            console.error("❌ Error fetching shops:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 right-0 z-[1000] backdrop-blur-sm py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Aktif Randevular" value={stats.activeAppointments.toString()} icon={<Calendar className="h-6 w-6 text-blue-500" />} onClick={() => navigate('/appointments')} />
                        <StatCard title="Kayıtlı Araçlar" value={stats.registeredVehicles.toString()} icon={<Car className="h-6 w-6 text-green-500" />} onClick={() => navigate('/vehicles')} />
                        <StatCard title="Favorilerim" value={Object.values(favoriteStatuses).filter(Boolean).length.toString()} icon={<Star className="h-6 w-6 text-yellow-500" />} onClick={() => navigate('/favorites')} />
                        <StatCard title="Servis Geçmişi" value={stats.serviceHistory.toString()} icon={<Clock className="h-6 w-6 text-purple-500" />} onClick={() => navigate('/history')} />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0">
                {!isLoading ? (
                    <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup className="custom-popup"><div className="glass-effect p-2"><span className="font-medium">Konumunuz</span></div></Popup>
                        </Marker>
                        {shops.filter(shop => shop.latitude && shop.longitude).map((shop) => (
                            <Marker key={shop.id} position={[shop.latitude!, shop.longitude!]} icon={shopIcon}>
                                <Popup className="custom-popup">
                                    <div className="glass-effect p-4 min-w-[250px]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-gray-800 flex-1">{shop.shopName}</h3>
                                            <button onClick={() => handleToggleFavorite(shop.id)} className={`p-2 rounded-full transition-colors duration-200 ml-2 ${favoriteStatuses[shop.id] ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`} title={favoriteStatuses[shop.id] ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
                                                <Star className="h-5 w-5" fill={favoriteStatuses[shop.id] ? 'currentColor' : 'none'} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{shop.address}</p>
                                        <div className="flex items-center mt-3"><Phone className="h-4 w-4 text-blue-500 mr-2" /><span className="text-sm text-gray-700">{shop.phone}</span></div>
                                        <div className="flex items-center mt-2"><Clock className="h-4 w-4 text-green-500 mr-2" /><span className="text-sm text-gray-700">{shop.openingHour} - {shop.closingHour}</span></div>
                                        <button onClick={() => navigate(`/shops/${shop.id}`)} className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out text-sm font-medium shadow-sm">Detayları Gör</button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Floating Roadside Assistance Button */}
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-[1000]">
                <div className="relative">
                    {/* Pulse Rings */}
                    <div className="absolute -inset-2 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-full h-full rounded-full bg-red-500/20 animate-ping"></div>
                        <div className="absolute w-4/5 h-4/5 rounded-full bg-red-500/15 animate-pulse"></div>
                    </div>

                    <button 
                        onClick={() => navigate('/service-requests')} 
                        className="relative group bg-red-600/40 backdrop-blur-sm border-2 border-red-500/50 
                                 text-white px-6 py-4 rounded-full shadow-2xl 
                                 hover:bg-red-600/60 hover:border-red-400/70 hover:shadow-red-500/40
                                 transition-colors duration-300 ease-in-out
                                 flex items-center space-x-3 whitespace-nowrap" 
                        title="Yol Yardım İsteği"
                    >
                        <Wrench className="h-6 w-6 text-white group-hover:text-white 
                                         transition-colors duration-300 drop-shadow-lg" />
                        <span className="font-bold text-sm lg:text-base text-white group-hover:text-white 
                                       drop-shadow-lg transition-colors duration-300">
                            Yol Yardım İsteği
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
