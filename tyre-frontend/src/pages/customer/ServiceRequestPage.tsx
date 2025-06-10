import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { 
    Plus, 
    X, 
    Clock, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    MessageSquare,
    Calendar,
    Zap,
    Send,
    Wrench,
    MapPin,
    Loader
} from 'lucide-react';

interface ServiceRequest {
    id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt?: string;
    response?: string;
}

interface NewServiceRequest {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    latitude: number;
    longitude: number;
}

const ServiceRequestPage: React.FC = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [newRequest, setNewRequest] = useState<NewServiceRequest>({
        title: '',
        description: '',
        priority: 'MEDIUM',
        latitude: 0,
        longitude: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/api/requests');
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching service requests:', error);
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setNewRequest(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    setGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Konum alınamadı. Lütfen konum izni verin veya manuel olarak konumunuzu belirtin.');
                    setGettingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            alert('Tarayıcınız konum özelliğini desteklemiyor.');
            setGettingLocation(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newRequest.latitude === 0 || newRequest.longitude === 0) {
            alert('Lütfen konumunuzu belirtin. Bu acil durum talebi için gereklidir.');
            return;
        }

        try {
            await axiosInstance.post('/api/requests', newRequest);
            setNewRequest({ title: '', description: '', priority: 'MEDIUM', latitude: 0, longitude: 0 });
            setShowForm(false);
            fetchRequests();
            alert('🚨 Acil durum talebi gönderildi! Yakındaki servisler bilgilendirildi.');
        } catch (error) {
            console.error('Error creating service request:', error);
            alert('Talep gönderilirken hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const getStatusConfig = (status: ServiceRequest['status']) => {
        switch (status) {
            case 'PENDING':
                return {
                    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                    icon: <Clock className="w-4 h-4" />,
                    text: 'Beklemede'
                };
            case 'ACCEPTED':
                return {
                    color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
                    icon: <Zap className="w-4 h-4" />,
                    text: 'Kabul Edildi'
                };
            case 'COMPLETED':
                return {
                    color: 'bg-green-500/20 text-green-400 border-green-500/50',
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: 'Tamamlandı'
                };
            case 'CANCELLED':
                return {
                    color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
                    icon: <XCircle className="w-4 h-4" />,
                    text: 'İptal Edildi'
                };
            default:
                return {
                    color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
                    icon: <Clock className="w-4 h-4" />,
                    text: 'Bilinmeyen'
                };
        }
    };

    const getPriorityConfig = (priority: ServiceRequest['priority']) => {
        switch (priority) {
            case 'HIGH':
                return {
                    color: 'bg-red-500/20 text-red-400 border-red-500/50',
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: 'Yüksek Öncelik'
                };
            case 'MEDIUM':
                return {
                    color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
                    icon: <Clock className="w-4 h-4" />,
                    text: 'Orta Öncelik'
                };
            case 'LOW':
                return {
                    color: 'bg-green-500/20 text-green-400 border-green-500/50',
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: 'Düşük Öncelik'
                };
            default:
                return {
                    color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
                    icon: <Clock className="w-4 h-4" />,
                    text: 'Bilinmeyen'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-600 p-3 rounded-full">
                            <Wrench className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Yol Yardım Talepleri</h1>
                            <p className="text-gray-400">Acil durum ve yardım taleplerinizi yönetin</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`group px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                            showForm 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600' 
                                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25'
                        }`}
                    >
                        {showForm ? (
                            <>
                                <X className="w-5 h-5" />
                                <span>İptal</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                <span>Yeni Talep Oluştur</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 mb-8 transform animate-in slide-in-from-top duration-300">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                            <MessageSquare className="w-6 h-6 text-red-500" />
                            <span>Yeni Yardım Talebi</span>
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    value={newRequest.title}
                                    onChange={(e) => setNewRequest(prev => ({...prev, title: e.target.value}))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                    placeholder="Örn: Lastik patladı, acil yardım gerekiyor"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest(prev => ({...prev, description: e.target.value}))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 h-32 resize-none"
                                    placeholder="Detaylı olarak sorununuzu açıklayın..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    Öncelik Seviyesi
                                </label>
                                <select
                                    value={newRequest.priority}
                                    onChange={(e) => setNewRequest(prev => ({...prev, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'}))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                >
                                    <option value="LOW">🟢 Düşük Öncelik</option>
                                    <option value="MEDIUM">🟡 Orta Öncelik</option>
                                    <option value="HIGH">🔴 Yüksek Öncelik</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    📍 Konum Bilgisi
                                </label>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={gettingLocation}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        {gettingLocation ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span>Konum Alınıyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-5 h-5" />
                                                <span>Mevcut Konumumu Al</span>
                                            </>
                                        )}
                                    </button>
                                    {(newRequest.latitude !== 0 || newRequest.longitude !== 0) && (
                                        <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-3">
                                            <div className="flex items-center space-x-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Konum Belirlendi</span>
                                            </div>
                                            <p className="text-xs text-green-300 mt-1">
                                                📍 {newRequest.latitude.toFixed(6)}, {newRequest.longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                            >
                                <Send className="w-5 h-5" />
                                <span>Talebi Gönder</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* Requests List */}
                <div className="space-y-6">
                    {requests.map((request, index) => {
                        const statusConfig = getStatusConfig(request.status);
                        const priorityConfig = getPriorityConfig(request.priority);
                        
                        return (
                            <div 
                                key={request.id} 
                                className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 hover:shadow-2xl hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                            <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{request.title}</h3>
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>Oluşturulma: {new Date(request.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center space-x-1 ${statusConfig.color}`}>
                                            {statusConfig.icon}
                                            <span>{statusConfig.text}</span>
                                </div>
                                        <div className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center space-x-1 ${priorityConfig.color}`}>
                                            {priorityConfig.icon}
                                            <span>{priorityConfig.text}</span>
                                </div>
                            </div>
                                </div>
                                
                                <p className="text-gray-300 mb-4 leading-relaxed">{request.description}</p>
                                
                            {request.response && (
                                    <div className="bg-gray-700/50 border border-gray-600 p-4 rounded-xl">
                                        <h4 className="font-semibold text-green-400 mb-2 flex items-center space-x-2">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Yanıt:</span>
                                        </h4>
                                        <p className="text-gray-300">{request.response}</p>
                                </div>
                            )}
                        </div>
                        );
                    })}

                    {/* Empty State */}
                    {requests.length === 0 && (
                        <div className="text-center py-16">
                            <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
                                <Wrench className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">Henüz hiç yardım talebi yok</h3>
                                <p className="text-gray-500 mb-6">Acil durumlarda veya yardıma ihtiyacınız olduğunda talep oluşturabilirsiniz.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2 mx-auto"
                            >
                                    <Plus className="w-5 h-5" />
                                    <span>İlk talebinizi oluşturun</span>
                            </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestPage;

