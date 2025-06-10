import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { Calendar, Clock, User, Phone, Car, MapPin, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Appointment {
    id: number;
    date: string;
    time: string;
    shopName: string;
    address: string;
    service: {
        id: number;
        serviceName: string;
        price: number;
    } | null;
    vehicle: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    // Shop-specific fields that might be added later
    customerName?: string;
    customerPhone?: string;
}

const ShopAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            const response = await axiosInstance.get(`/api/appointments/shop/${shopId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (appointmentId: number, status: string) => {
        try {
            await axiosInstance.put(`/api/appointments/${appointmentId}/status`, { status });
            await loadAppointments();
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Randevu durumu güncellenirken hata oluştu.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">Beklemede</span>;
            case 'CONFIRMED':
                return <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">Onaylandı</span>;
            case 'COMPLETED':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Tamamlandı</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-300">İptal</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-900 text-gray-300">Bilinmeyen</span>;
        }
    };    const filteredAppointments = appointments.filter(appointment => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            (appointment.vehicle && appointment.vehicle.toLowerCase().includes(searchLower)) ||
            (appointment.service && appointment.service.serviceName && appointment.service.serviceName.toLowerCase().includes(searchLower)) ||
            (appointment.customerName && appointment.customerName.toLowerCase().includes(searchLower));
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Randevular</h1>
                    <p className="text-gray-400">Müşteri randevularınızı yönetin</p>
                </div>

                {/* Filtreler */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Müşteri adı, araç veya hizmet ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="PENDING">Beklemede</option>
                                <option value="CONFIRMED">Onaylandı</option>
                                <option value="COMPLETED">Tamamlandı</option>
                                <option value="CANCELLED">İptal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Randevu Listesi */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Randevular yükleniyor...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="p-8 text-center">
                            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Henüz randevu bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Müşteri
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Araç
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Hizmet
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tarih & Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">                                    {filteredAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-100">
                                                            {appointment.customerName || 'Müşteri Bilgisi Mevcut Değil'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            {appointment.customerPhone || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-300">{appointment.vehicle || 'Araç bilgisi mevcut değil'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div>{appointment.service ? appointment.service.serviceName : 'Hizmet bilgisi mevcut değil'}</div>
                                                    {appointment.service && appointment.service.price && (
                                                        <div className="text-xs text-green-400 font-semibold">
                                                            ₺{appointment.service.price.toLocaleString('tr-TR')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {new Date(appointment.date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {appointment.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(appointment.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    {appointment.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                                            className="text-green-400 hover:text-green-300 transition-colors"
                                                            title="Onayla"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {appointment.status === 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="Tamamla"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                            title="İptal Et"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopAppointments;

