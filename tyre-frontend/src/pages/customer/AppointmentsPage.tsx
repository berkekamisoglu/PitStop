import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, CheckCircle, XCircle, Plus, Star } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Appointment {
    id: number;
    date: string;
    time: string;
    shopName: string;
    address: string;
    service: Service | string;
    vehicle: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

interface TireShop {
    id: number;
    shopName: string;
    address: string;
}

interface Service {
    id: number;
    serviceName: string;
    price: number;
}

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    plate: string;
}

const AppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tireShops, setTireShops] = useState<TireShop[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedShop, setSelectedShop] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchAppointments = async () => {
        try {
            const response = await axiosInstance.get('/api/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Randevular yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shopsRes, vehiclesRes] = await Promise.all([
                    axiosInstance.get('/api/tireshops'),
                    axiosInstance.get('/api/user-vehicles')
                ]);

                setTireShops(shopsRes.data);
                setVehicles(vehiclesRes.data);
                
                // Eğer daha önce seçili bir lastikçi yoksa tüm hizmetleri getir
                if (!selectedShop) {
                    const servicesRes = await axiosInstance.get('/api/tire-shop-services');
                    console.log('Initial services response:', servicesRes.data);
                    // Filter out any null or invalid services
                    const validServices = servicesRes.data.filter((service: Service) => 
                        service && 
                        service.id && 
                        service.serviceName && 
                        typeof service.price === 'number'
                    );
                    setServices(validServices);
                }
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
                setError('Veriler yüklenirken bir hata oluştu.');
            }
        };

        if (isModalOpen) {
            fetchData();
        }
    }, [isModalOpen]);

    // Lastikçi seçildiğinde o lastikçiye özel hizmetleri getir
    useEffect(() => {
        const fetchShopServices = async () => {
            if (selectedShop) {
                try {
                    const response = await axiosInstance.get(`/api/tire-shop-services/shop/${selectedShop}`);
                    console.log('Services response:', response.data);
                    // Filter out any null or invalid services
                    const validServices = response.data.filter((service: Service) => 
                        service && 
                        service.id && 
                        service.serviceName && 
                        typeof service.price === 'number'
                    );
                    setServices(validServices);
                    // Eğer seçili hizmet artık mevcut değilse temizle
                    if (selectedService) {
                        const serviceExists = validServices.some((service: Service) => service.id.toString() === selectedService);
                        if (!serviceExists) {
                            setSelectedService('');
                        }
                    }
                } catch (error) {
                    console.error('Lastikçi hizmetleri yüklenirken hata:', error);
                    setServices([]);
                }
            } else {
                // Lastikçi seçimi temizlendiğinde tüm hizmetleri getir
                try {
                    const response = await axiosInstance.get('/api/tire-shop-services');
                    console.log('All services response:', response.data);
                    // Filter out any null or invalid services
                    const validServices = response.data.filter((service: Service) => 
                        service && 
                        service.id && 
                        service.serviceName && 
                        typeof service.price === 'number'
                    );
                    setServices(validServices);
                } catch (error) {
                    console.error('Hizmetler yüklenirken hata:', error);
                    setServices([]);
                }
            }
        };

        fetchShopServices();
    }, [selectedShop]);

    const handleCancel = async (appointmentId: number) => {
        if (!window.confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
            return;
        }

        setCancelLoading(appointmentId);
        try {
            await axiosInstance.put(`/api/appointments/${appointmentId}`, {
                status: 'CANCELLED'
            });
            await fetchAppointments();
        } catch (error) {
            console.error('Randevu iptal edilirken hata:', error);
            alert('Randevu iptal edilirken bir hata oluştu.');
        } finally {
            setCancelLoading(null);
        }
    };

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime || !selectedShop || !selectedService || !selectedVehicle) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        setCreating(true);
        setError('');

        try {
            await axiosInstance.post('/api/appointments', {
                appointmentDate: `${selectedDate}T${selectedTime}`,
                tireShopId: parseInt(selectedShop),
                serviceId: parseInt(selectedService),
                vehicleId: parseInt(selectedVehicle),
                status: 'PENDING'
            });

            setIsModalOpen(false);
            await fetchAppointments();
            // Reset form
            setSelectedDate('');
            setSelectedTime('');
            setSelectedShop('');
            setSelectedService('');
            setSelectedVehicle('');
        } catch (error) {
            console.error('Randevu oluşturulurken hata:', error);
            setError('Randevu oluşturulurken bir hata meydana geldi.');
        } finally {
            setCreating(false);
        }
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i <= 17; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-gradient-to-r from-yellow-400 to-orange-500';
            case 'CONFIRMED':
                return 'bg-gradient-to-r from-blue-400 to-indigo-500';
            case 'COMPLETED':
                return 'bg-gradient-to-r from-green-400 to-emerald-500';
            case 'CANCELLED':
                return 'bg-gradient-to-r from-red-400 to-rose-500';
            default:
                return 'bg-gradient-to-r from-gray-400 to-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Beklemede';
            case 'CONFIRMED':
                return 'Onaylandı';
            case 'COMPLETED':
                return 'Tamamlandı';
            case 'CANCELLED':
                return 'İptal Edildi';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4" />;
            case 'CONFIRMED':
                return <CheckCircle className="w-4 h-4" />;
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-r-red-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-red-400 opacity-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                                📅 Randevularım
                            </h1>
                            <p className="text-gray-300 mt-2">Yaklaşan ve geçmiş randevularınızı yönetin</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold">Yeni Randevu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {appointments.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 relative">
                                <Calendar className="w-16 h-16 text-red-400" />
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Henüz randevunuz bulunmuyor</h3>
                            <p className="text-gray-400 mb-8 text-lg">İlk randevunuzu oluşturun ve lastik bakım sürecinizi başlatın</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                            >
                                <Plus className="w-6 h-6" />
                                <span className="font-semibold text-lg">İlk Randevunu Oluştur</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {appointments.map((appointment, index) => (
                            <div key={appointment.id} 
                                 className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-red-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10"
                                 style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-6">
                                        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-4 shadow-lg">
                                            <Calendar className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-3">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                                                    {typeof appointment.service === 'object' && appointment.service ? 
                                                        appointment.service.serviceName : 
                                                        (appointment.service || 'Hizmet bilgisi mevcut değil')
                                                    }
                                                </h3>
                                                {typeof appointment.service === 'object' && appointment.service && appointment.service.price && (
                                                    <div className="flex items-center mt-2">
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                                            ₺{appointment.service.price.toLocaleString('tr-TR')}
                                                        </span>
                                                        <span className="ml-2 text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg">
                                                            Hizmet Ücreti
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                    <Clock className="w-5 h-5 mr-3 text-red-400" />
                                                    <span className="text-lg">
                                                        {new Date(appointment.date).toLocaleDateString('tr-TR', { 
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })} - {appointment.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                    <MapPin className="w-5 h-5 mr-3 text-red-400" />
                                                    <span className="text-lg">{appointment.shopName}</span>
                                                    <span className="mx-2">•</span>
                                                    <span className="text-gray-400">{appointment.address}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                                                    <Car className="w-5 h-5 mr-3 text-red-400" />
                                                    <span className="text-lg">{appointment.vehicle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-white font-semibold shadow-lg flex items-center space-x-2 ${getStatusColor(appointment.status)}`}>
                                        {getStatusIcon(appointment.status)}
                                        <span>{getStatusText(appointment.status)}</span>
                                    </div>
                                </div>
                                {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => handleCancel(appointment.id)}
                                            disabled={cancelLoading === appointment.id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-600/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>{cancelLoading === appointment.id ? 'İptal Ediliyor...' : 'İptal Et'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modern Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full p-8 border border-gray-700/50 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white">🚗 Yeni Randevu Oluştur</h2>
                                <p className="text-gray-400 mt-2">Lastik bakım randevunuzu planlayın</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 flex items-center space-x-3">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateAppointment} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        🏪 Lastikçi Seçin
                                    </label>
                                    <select
                                        value={selectedShop}
                                        onChange={(e) => {
                                            setSelectedShop(e.target.value);
                                            // Lastikçi değiştirildiğinde hizmet seçimini temizle
                                            setSelectedService('');
                                        }}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Lastikçi seçin</option>
                                        {tireShops.map((shop) => (
                                            <option key={shop.id} value={shop.id}>
                                                {shop.shopName} - {shop.address}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        🔧 Hizmet Seçin
                                    </label>
                                    <select
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        disabled={!selectedShop}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {!selectedShop ? 'Önce lastikçi seçin' : 'Hizmet seçin'}
                                        </option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.serviceName} - ₺{service.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        🚙 Araç Seçin
                                    </label>
                                    <select
                                        value={selectedVehicle}
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Araç seçin</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} - {vehicle.plate}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        📅 Tarih Seçin
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    ⏰ Saat Seçin
                                </label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Saat seçin</option>
                                    {generateTimeSlots().map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-gray-300 bg-gray-700/50 border border-gray-600/50 rounded-xl hover:bg-gray-600/50 hover:text-white transition-all duration-200"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Oluşturuluyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-4 h-4" />
                                            <span>Randevu Oluştur</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;

