import React, { useState, useRef, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import StatCard from '../../components/StatCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { ChevronLeft, ChevronRight, Menu, Car, Clock, MapPin, Star, DollarSign, Users, Wrench, Package, Phone, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';
import tireShopService from '../../services/TireShopService';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

// Global CSS for emergency alarm animation
const GlobalStyle = () => (
    <style>{`
        @keyframes emergency-pulse {
            0% { 
                transform: scale(1); 
                box-shadow: 0 4px 8px rgba(220, 38, 38, 0.5), 0 0 0 0 rgba(220, 38, 38, 0.8); 
            }
            50% { 
                transform: scale(1.1); 
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.7), 0 0 0 15px rgba(220, 38, 38, 0); 
            }
            100% { 
                transform: scale(1); 
                box-shadow: 0 4px 8px rgba(220, 38, 38, 0.5), 0 0 0 0 rgba(220, 38, 38, 0); 
            }
        }
        
        .emergency-alarm-marker div {
            animation: emergency-pulse 1.5s infinite !important;
        }
        
        .emergency-accepted-marker div {
            animation: none !important;
        }
    `}</style>
);

// Özel servis noktası ikonu
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

// Özel kendi dükkanım ikonu
const myShopIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
        background-color: #10B981;
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

// Acil yardım talebi alarm ikonu (PENDING durumu için)
const emergencyAlarmIcon = L.divIcon({
    className: 'emergency-alarm-marker',
    html: `<div style="
        background-color: #DC2626;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: center bottom;
    ">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
        </svg>
    </div>`,
    iconSize: [80, 80],
    iconAnchor: [40, 80],
    popupAnchor: [0, -80]
});

// Kabul edilmiş acil yardım talebi ikonu
const emergencyAcceptedIcon = L.divIcon({
    className: 'emergency-accepted-marker',
    html: `<div style="
        background-color: #059669;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 3px 6px rgba(5, 150, 105, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: center bottom;
    ">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
    </div>`,
    iconSize: [70, 70],
    iconAnchor: [35, 70],
    popupAnchor: [0, -70]
});

interface TireShopInfo {
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

interface EmergencyRequest {
    id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    latitude: number;
    longitude: number;
    createdAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
}

// Harita bileşeni
interface MapComponentProps {
    emergencyRequests: EmergencyRequest[];
    onAcceptRequest: (requestId: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ emergencyRequests, onAcceptRequest }) => {
    const [shopPosition, setShopPosition] = useState<LatLngExpression | null>(null);
    const [allShops, setAllShops] = useState<TireShopInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const map = useMap();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('Current userId:', userId);
        console.log('Current token:', localStorage.getItem('token'));
        
        const loadShopData = async () => {
            try {
                // Tüm lastikçileri getir
                const shops = await tireShopService.getAllTireShops();
                setAllShops(shops);

                // Kendi dükkanımın bilgilerini getir
                if (userId) {
                    const myShop = await tireShopService.getTireShopInfo(userId);
                    if (myShop.latitude && myShop.longitude) {
                        const position: LatLngExpression = [myShop.latitude, myShop.longitude];
                        setShopPosition(position);
                        map.setView(position, 13);
                    } else {
                        console.error('Shop coordinates are missing:', myShop);
                        setError('Dükkan koordinatları bulunamadı. Haritaya tıklayarak konum seçin.');
                        
                        // Add click handler to map when coordinates are missing
                        map.on('click', async (e) => {
                            const { lat, lng } = e.latlng;
                            try {
                                await tireShopService.updateShopCoordinates(userId, lat, lng);
                                setShopPosition([lat, lng]);
                                setError(null);
                                map.setView([lat, lng], 13);
                            } catch (err) {
                                console.error('Failed to update coordinates:', err);
                                setError('Koordinatlar güncellenirken hata oluştu.');
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Lastikçi bilgileri alınamadı:", error);
                setError('Lastikçi bilgileri alınamadı');
            }
        };

        loadShopData();

        // Cleanup function to remove click handler
        return () => {
            map.off('click');
        };
    }, [map]);

    return (
        <>
            {error && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-[1000]">
                    {error}
                </div>
            )}
            {/* Diğer lastikçileri göster */}
            {allShops.map((shop) => {
                if (!shop.latitude || !shop.longitude) return null;
                const isMyShop = shop.id.toString() === localStorage.getItem('userId');
                if (isMyShop) return null; // Kendi dükkanımı burada gösterme

                return (
                    <Marker 
                        key={shop.id}
                        position={[shop.latitude, shop.longitude]} 
                        icon={shopIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-semibold text-lg mb-2">{shop.shopName}</h3>
                                <p className="text-sm text-gray-600 mb-1">{shop.address}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <Clock className="inline-block w-4 h-4 mr-1" />
                                    {shop.openingHour} - {shop.closingHour}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <Phone className="inline-block w-4 h-4 mr-1" />
                                    {shop.phone}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            {/* Kendi dükkanımı göster */}
            {shopPosition && (
                <Marker position={shopPosition} icon={myShopIcon}>
                    <Popup>
                        <div className="text-sm font-medium">
                            <span className="text-green-600">★</span> Servis Noktanız
                        </div>
                    </Popup>
                </Marker>
            )}
            
            {/* Acil yardım taleplerini göster */}
            {emergencyRequests.map((request) => {
                const isAccepted = request.status === 'ACCEPTED';
                const icon = isAccepted ? emergencyAcceptedIcon : emergencyAlarmIcon;
                
                return (
                    <Marker 
                        key={request.id}
                        position={[request.latitude, request.longitude]} 
                        icon={icon}
                    >
                        <Popup>
                            <div className="p-3 min-w-[250px]">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg text-red-600">{request.title}</h3>
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        request.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                        request.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {request.priority === 'HIGH' ? '🔴 Yüksek' :
                                         request.priority === 'MEDIUM' ? '🟡 Orta' : '🟢 Düşük'}
                                    </div>
                                </div>
                                
                                <p className="text-gray-700 mb-3">{request.description}</p>
                                
                                {/* Müşteri Bilgileri */}
                                {request.user && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            Müşteri Bilgileri
                                        </h4>
                                        <div className="text-sm text-blue-700">
                                            <div className="flex items-center mb-1">
                                                <span className="font-medium">İsim:</span>
                                                <span className="ml-2">{request.user.name}</span>
                                            </div>
                                            {request.user.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    <span className="font-medium">Tel:</span>
                                                    <span className="ml-2">{request.user.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(request.createdAt).toLocaleString('tr-TR')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>📍 {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
                                    </div>
                                </div>

                                {request.status === 'PENDING' ? (
                                    <button
                                        onClick={() => onAcceptRequest(request.id)}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>🚨 Acil Yardıma Git!</span>
                                    </button>
                                ) : (
                                    <div className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-center flex items-center justify-center space-x-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>✅ Talep Kabul Edildi</span>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

const ShopDashboard: React.FC = () => {
    const defaultPosition: LatLngExpression = [41.168774, 29.560501];
    const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
    const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const mapRef = useRef<any>(null);
    const shopName = localStorage.getItem('userName') || 'Servis';
    const shopId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current.invalidateSize();
            }, 350);
        }
    }, [isLeftPanelVisible]);

    useEffect(() => {
        loadEmergencyRequests();
        // Her 30 saniyede bir yenile
        const interval = setInterval(loadEmergencyRequests, 30000);
        return () => clearInterval(interval);
    }, [shopId]);

    const loadEmergencyRequests = async () => {
        if (!shopId) return;
        
        setLoadingRequests(true);
        try {
            const response = await axiosInstance.get(`/api/requests/nearby/${shopId}`);
            setEmergencyRequests(response.data);
        } catch (error) {
            console.error('Error loading emergency requests:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const acceptRequest = async (requestId: number) => {
        try {
            await axiosInstance.put(`/api/requests/${requestId}/accept`);
            await loadEmergencyRequests(); // Listeyi yenile
            alert('✅ Acil yardım talebi kabul edildi!');
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('❌ Talep kabul edilirken hata oluştu.');
        }
    };

    const getPriorityColor = (priority: EmergencyRequest['priority']) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'MEDIUM':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case 'LOW':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const getPriorityText = (priority: EmergencyRequest['priority']) => {
        switch (priority) {
            case 'HIGH':
                return '🔴 Yüksek';
            case 'MEDIUM':
                return '🟡 Orta';
            case 'LOW':
                return '🟢 Düşük';
            default:
                return 'Bilinmeyen';
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <GlobalStyle />
            <ShopSidebar />

            <div className="flex-1 flex relative">
                {/* Sol taraf - Dashboard içeriği */}
                <div className={`transition-all duration-300 ease-in-out ${isLeftPanelVisible ? 'w-1/2 p-6' : 'w-0 p-0'} overflow-hidden relative`}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-white">Hoşgeldiniz, {shopName} 👋</h1>
                    </div>
                    {/* Panel açıkken sağ kenarda ortalanmış kapama butonu */}
                    {isLeftPanelVisible && (
                        <button
                            onClick={() => setIsLeftPanelVisible(false)}
                            className="absolute top-1/2 right-0 -translate-y-1/2 z-[1000] bg-gray-800 border border-gray-700 h-16 w-6 flex items-center justify-center p-0 text-white hover:text-red-500 shadow-lg transition-colors rounded-none"
                            style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <StatCard
                                title="Bugünkü Randevular"
                                value="8"
                                icon={<Clock className="w-6 h-6 text-blue-500" />}
                                onClick={() => navigate('/shop/appointments')}
                            />
                            <StatCard
                                title="Aktif Müşteriler"
                                value="12"
                                icon={<Users className="w-6 h-6 text-green-500" />}
                                onClick={() => navigate('/shop/customers')}
                            />
                            <StatCard
                                title="Günlük Gelir"
                                value="₺2,450"
                                icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
                                onClick={() => navigate('/shop/revenue')}
                            />
                            <StatCard
                                title="Stok Durumu"
                                value="156"
                                icon={<Package className="w-6 h-6 text-purple-500" />}
                                onClick={() => navigate('/shop/stock')}
                            />
                        </div>
                    </div>

                    {/* Acil Yardım Talepleri */}
                    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-600 p-2 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Acil Yardım Talepleri</h2>
                                {emergencyRequests.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        {emergencyRequests.length}
                                    </span>
                                )}
                            </div>
                            {loadingRequests && (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                            )}
                        </div>

                        {emergencyRequests.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                <p>🎉 Şu anda yakınınızda acil yardım talebi yok!</p>
                                <p className="text-sm mt-1">Yeni talepler otomatik olarak burada görünecek.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {emergencyRequests.map((request) => (
                                    <div key={request.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-red-500/50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold">{request.title}</h4>
                                                <p className="text-gray-300 text-sm mt-1">{request.description}</p>
                                                
                                                {/* Müşteri Bilgileri */}
                                                {request.user && (
                                                    <div className="mt-2 p-2 bg-gray-600 rounded-md">
                                                        <div className="flex items-center text-sm text-blue-300">
                                                            <User className="w-3 h-3 mr-1" />
                                                            <span className="font-medium">{request.user.name}</span>
                                                            {request.user.phone && (
                                                                <>
                                                                    <Phone className="w-3 h-3 ml-3 mr-1" />
                                                                    <span>{request.user.phone}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(request.priority)}`}>
                                                {getPriorityText(request.priority)}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(request.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>📍 Yakın konum</span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => acceptRequest(request.id)}
                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Kabul Et</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Bugünkü Randevular</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Müşteri
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Hizmet
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Araç
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Durum
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    <tr className="hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-100">
                                                        Ahmet Yılmaz
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        +90 555 123 4567
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            Lastik Değişimi
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Car className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-300">BMW 320i (34 ABC 123)</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            14:30
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                                                Beklemede
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Harita bölümü */}
                <div className={`transition-all duration-300 ease-in-out ${isLeftPanelVisible ? 'w-1/2' : 'w-full'} h-screen sticky top-0`}>
                    {!isLeftPanelVisible && (
                        <button
                            onClick={() => setIsLeftPanelVisible(true)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-[1000] bg-gray-800 border border-gray-700 h-16 w-6 flex items-center justify-center p-0 text-white hover:text-red-500 shadow-lg transition-colors rounded-none"
                            style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                    <MapContainer 
                        center={defaultPosition} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-lg shadow-lg"
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent 
                            emergencyRequests={emergencyRequests}
                            onAcceptRequest={acceptRequest}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default ShopDashboard;
