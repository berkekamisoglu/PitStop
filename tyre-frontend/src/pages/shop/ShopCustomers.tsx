import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { Users, User, Phone, Mail, Car, Calendar, Search, Eye, Star } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    totalVisits: number;
    lastVisit?: string;
    totalSpent: number;
    vehicles?: Vehicle[];
    rating?: number;
}

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
}

const ShopCustomers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);    const loadCustomers = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            
            // Get customers through appointments since there's no direct shop-customer relationship
            const appointmentsResponse = await axiosInstance.get(`/api/appointments/shop/${shopId}`);
            
            // Extract unique customers from appointments
            const customerMap = new Map<number, Customer>();
            
            appointmentsResponse.data.forEach((appointment: any) => {
                if (appointment.user) {
                    const customerId = appointment.user.id;
                    if (!customerMap.has(customerId)) {
                        customerMap.set(customerId, {
                            id: customerId,
                            name: appointment.user.username || 'Bilinmeyen Müşteri',
                            email: appointment.user.email || '',
                            phone: appointment.user.phone || '',
                            totalVisits: 1,
                            lastVisit: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : '',
                            totalSpent: 0, // Would need invoice data to calculate this
                            rating: 4.5, // Default rating
                            vehicles: []
                        });
                    } else {
                        // Update visit count and last visit
                        const customer = customerMap.get(customerId)!;
                        customer.totalVisits += 1;
                        const appointmentDate = appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : '';
                        if (!customer.lastVisit || appointmentDate > customer.lastVisit) {
                            customer.lastVisit = appointmentDate;
                        }
                    }
                }
            });
            
            setCustomers(Array.from(customerMap.values()));
        } catch (error) {
            console.error('Error loading customers:', error);
            // Keep empty customers on error
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
    );

    const openCustomerDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowDetails(true);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
            />
        ));
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Müşteriler</h1>
                    <p className="text-gray-400">Müşteri bilgilerini görüntüleyin ve yönetin</p>
                </div>

                {/* Arama */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Müşteri adı, email veya telefon ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                        />
                    </div>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Müşteri</p>
                                <p className="text-2xl font-bold text-white">{customers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Star className="w-8 h-8 text-yellow-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Ortalama Puan</p>
                                <p className="text-2xl font-bold text-white">
                                    {customers.length > 0 ? 
                                        (customers.reduce((acc, c) => acc + (c.rating || 0), 0) / customers.length).toFixed(1) 
                                        : '0.0'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Car className="w-8 h-8 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Araç</p>
                                <p className="text-2xl font-bold text-white">
                                    {customers.reduce((acc, c) => acc + (c.vehicles?.length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Müşteri Listesi */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Müşteriler yükleniyor...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Müşteri bulunamadı.</p>
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
                                            İletişim
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Ziyaret
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Harcama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Puan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-100">
                                                            {customer.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {customer.vehicles?.length || 0} araç
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div className="flex items-center mb-1">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {customer.email}
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center text-xs text-gray-400">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            {customer.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div>{customer.totalVisits} ziyaret</div>
                                                    {customer.lastVisit && (
                                                        <div className="text-xs text-gray-400">
                                                            Son: {new Date(customer.lastVisit).toLocaleDateString('tr-TR')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                ₺{customer.totalSpent.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {customer.rating && renderStars(customer.rating)}
                                                    {customer.rating && (
                                                        <span className="ml-2 text-sm text-gray-300">
                                                            {customer.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openCustomerDetails(customer)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    title="Detayları Gör"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Müşteri Detayları Modal */}
            {showDetails && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Müşteri Detayları</h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">{selectedCustomer.name}</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white ml-2">{selectedCustomer.email}</span>
                                    </div>
                                    {selectedCustomer.phone && (
                                        <div>
                                            <span className="text-gray-400">Telefon:</span>
                                            <span className="text-white ml-2">{selectedCustomer.phone}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-400">Toplam Ziyaret:</span>
                                        <span className="text-white ml-2">{selectedCustomer.totalVisits}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Toplam Harcama:</span>
                                        <span className="text-white ml-2">₺{selectedCustomer.totalSpent.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedCustomer.vehicles && selectedCustomer.vehicles.length > 0 && (
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-white mb-3">Araçları</h4>
                                    <div className="space-y-2">
                                        {selectedCustomer.vehicles.map((vehicle) => (
                                            <div key={vehicle.id} className="bg-gray-600 rounded p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-white font-medium">
                                                            {vehicle.brand} {vehicle.model}
                                                        </span>
                                                        <span className="text-gray-300 ml-2">({vehicle.year})</span>
                                                    </div>
                                                    <span className="text-gray-300">{vehicle.plateNumber}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopCustomers;

