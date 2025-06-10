import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Calendar, Clock, Car, CreditCard, CheckCircle, AlertCircle, XCircle, Wrench, Star, Filter, Search, MapPin } from 'lucide-react';

interface ServiceHistory {
    id: number;
    date: string;
    serviceType: string;
    description: string;
    cost: number;
    status: string;
    shopName?: string;
    vehiclePlate?: string;
    rating?: number;
}

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<ServiceHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'cost' | 'status'>('date');

    // Fake data since API might not exist
    const fakeData: ServiceHistory[] = [
        {
            id: 1,
            date: '2024-01-15T10:30:00',
            serviceType: 'Lastik Değişimi',
            description: '4 adet yazlık lastik montajı ve balans ayarı yapıldı',
            cost: 2500,
            status: 'Tamamlandı',
            shopName: 'Koçoğlu Lastik',
            vehiclePlate: '34 ABC 123',
            rating: 5
        },
        {
            id: 2,
            date: '2024-01-02T14:15:00',
            serviceType: 'Balans Ayarı',
            description: 'Ön aksın balans ayarı ve hizalama kontrolü',
            cost: 400,
            status: 'Tamamlandı',
            shopName: 'Berke Lastik Center',
            vehiclePlate: '34 ABC 123',
            rating: 4
        },
        {
            id: 3,
            date: '2023-12-20T09:00:00',
            serviceType: 'Lastik Tamiri',
            description: 'Sol ön lastik yanak tamiri ve basınç kontrolü',
            cost: 150,
            status: 'Tamamlandı',
            shopName: 'Hızır Lastik',
            vehiclePlate: '06 XYZ 789',
            rating: 3
        },
        {
            id: 4,
            date: '2023-12-05T16:45:00',
            serviceType: 'Rot Balans',
            description: 'Genel rot balans ayarı ve lastik rotasyonu',
            cost: 600,
            status: 'Devam Ediyor',
            shopName: 'ProTire Service',
            vehiclePlate: '34 ABC 123'
        },
        {
            id: 5,
            date: '2023-11-28T11:20:00',
            serviceType: 'Acil Yol Yardımı',
            description: 'Sağ arka lastik patlaması, yedek lastik montajı',
            cost: 200,
            status: 'Tamamlandı',
            shopName: 'Yol Yardım Plus',
            vehiclePlate: '06 XYZ 789',
            rating: 5
        }
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Try to fetch from API first
                // const response = await axiosInstance.get('/api/service-history');
                // setHistory(response.data);
                
                // For now use fake data
                setTimeout(() => {
                    setHistory(fakeData);
                setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching service history:', error);
                // Fallback to fake data on error
                setHistory(fakeData);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'tamamlandı':
            case 'completed':
                return 'bg-gradient-to-r from-green-500 to-emerald-500';
            case 'devam ediyor':
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500';
            case 'iptal':
            case 'cancelled':
                return 'bg-gradient-to-r from-red-500 to-rose-500';
            default:
                return 'bg-gradient-to-r from-gray-500 to-slate-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'tamamlandı':
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'devam ediyor':
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'iptal':
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getServiceIcon = (serviceType: string) => {
        if (serviceType.toLowerCase().includes('lastik')) {
            return <Car className="w-6 h-6" />;
        } else if (serviceType.toLowerCase().includes('balans') || serviceType.toLowerCase().includes('rot')) {
            return <Wrench className="w-6 h-6" />;
        } else {
            return <Wrench className="w-6 h-6" />;
        }
    };

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    />
                ))}
                <span className="text-sm text-gray-400 ml-2">({rating}/5)</span>
            </div>
        );
    };

    const filteredHistory = history.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'completed' && item.status.toLowerCase().includes('tamamlandı')) ||
            (filter === 'pending' && item.status.toLowerCase().includes('devam')) ||
            (filter === 'cancelled' && item.status.toLowerCase().includes('iptal'));
        
        const matchesSearch = item.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.shopName?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesFilter && matchesSearch;
    });

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'cost':
                return b.cost - a.cost;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-blue-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                📋 Servis Geçmişi
                            </h1>
                            <p className="text-gray-300 mt-2">Tüm lastik bakım ve servis geçmişinizi görüntüleyin</p>
                        </div>
                        
                        {/* Filters and Search */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Servis ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700/50 border border-gray-600/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-64"
                                />
                            </div>
                            
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="all">Tüm Servisler</option>
                                <option value="completed">Tamamlanan</option>
                                <option value="pending">Devam Eden</option>
                                <option value="cancelled">İptal Edilen</option>
                            </select>
                            
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="date">Tarihe Göre</option>
                                <option value="cost">Maliyete Göre</option>
                                <option value="status">Duruma Göre</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sortedHistory.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 relative">
                                <Calendar className="w-16 h-16 text-blue-400" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Servis geçmişi bulunamadı</h3>
                            <p className="text-gray-400 mb-8 text-lg">Arama kriterlerinizi değiştirin veya yeni servis alın</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {sortedHistory.map((item, index) => (
                            <div key={item.id} 
                                 className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                                 style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                                    <div className="flex items-start space-x-6 flex-1">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-4 shadow-lg">
                                            {getServiceIcon(item.serviceType)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 sm:mb-0">
                                    {item.serviceType}
                                                </h3>
                                                <div className={`px-4 py-2 rounded-xl text-white font-semibold shadow-lg flex items-center space-x-2 ${getStatusColor(item.status)}`}>
                                                    {getStatusIcon(item.status)}
                                                    <span>{item.status}</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-300 text-lg mb-4 group-hover:text-white transition-colors">
                                    {item.description}
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                                                    <div>
                                                        <p className="font-semibold">Tarih</p>
                                                        <p>{new Date(item.date).toLocaleDateString('tr-TR')}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                    <CreditCard className="w-5 h-5 mr-3 text-green-400" />
                                                    <div>
                                                        <p className="font-semibold">Maliyet</p>
                                                        <p className="text-green-400 font-bold">
                                                            ₺{item.cost.toLocaleString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {item.shopName && (
                                                    <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                        <MapPin className="w-5 h-5 mr-3 text-red-400" />
                                                        <div>
                                                            <p className="font-semibold">Servis</p>
                                                            <p>{item.shopName}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {item.vehiclePlate && (
                                                    <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                        <Car className="w-5 h-5 mr-3 text-purple-400" />
                                                        <div>
                                                            <p className="font-semibold">Araç</p>
                                                            <p>{item.vehiclePlate}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {item.rating && (
                                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-300 font-semibold">Değerlendirmeniz:</span>
                                                        {renderStars(item.rating)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Time and additional info */}
                                <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                                    <div className="flex items-center text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{new Date(item.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Servis ID: #{item.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Summary Stats */}
                {sortedHistory.length > 0 && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                                {sortedHistory.length}
                            </div>
                            <div className="text-gray-300">Toplam Servis</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                ₺{sortedHistory.reduce((sum, item) => sum + item.cost, 0).toLocaleString('tr-TR')}
                            </div>
                            <div className="text-gray-300">Toplam Harcama</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">
                                {(sortedHistory.filter(item => item.rating).reduce((sum, item) => sum + (item.rating || 0), 0) / sortedHistory.filter(item => item.rating).length || 0).toFixed(1)}
                            </div>
                            <div className="text-gray-300">Ortalama Değerlendirme</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

