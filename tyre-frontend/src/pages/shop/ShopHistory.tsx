import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { History, Calendar, User, Car, DollarSign, Search, Filter, Eye } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Transaction {
    id: number;
    date: string;
    customerName: string;
    customerPhone: string;
    vehicleInfo: string;
    serviceType: string;
    amount: number;
    paymentMethod: string;
    status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    notes?: string;
}

const ShopHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetails, setShowDetails] = useState(false);    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            
            // Get transaction history from completed appointments
            const appointmentsResponse = await axiosInstance.get(`/api/appointments/shop/${shopId}`);
            
            // Filter completed appointments and map to transactions
            const mappedTransactions: Transaction[] = appointmentsResponse.data
                .filter((appointment: any) => appointment.status === 'COMPLETED')
                .map((appointment: any) => ({
                    id: appointment.id,
                    date: appointment.appointmentDate || new Date().toISOString(),
                    customerName: appointment.user?.username || 'Bilinmeyen Müşteri',
                    customerPhone: appointment.user?.phone || '',
                    vehicleInfo: 'Araç Bilgisi', // Would need user vehicle data
                    serviceType: appointment.service?.serviceName || 'Genel Hizmet',
                    amount: 100, // Default amount - would need invoice data
                    paymentMethod: 'Nakit', // Default payment method
                    status: 'COMPLETED' as const,
                    notes: `Randevu ID: ${appointment.id}`
                }));
            
            setTransactions(mappedTransactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
            // Keep empty transactions on error
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Tamamlandı</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-300">İptal</span>;
            case 'REFUNDED':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">İade</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-900 text-gray-300">Bilinmeyen</span>;
        }
    };

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case 'Kredi Kartı':
                return 'bg-blue-900 text-blue-300';
            case 'Nakit':
                return 'bg-green-900 text-green-300';
            case 'Havale/EFT':
                return 'bg-purple-900 text-purple-300';
            default:
                return 'bg-gray-900 text-gray-300';
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const transactionDate = new Date(transaction.date);
            const now = new Date();
            
            switch (dateFilter) {
                case 'today':
                    matchesDate = transactionDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = transactionDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = transactionDate >= monthAgo;
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    const totalAmount = filteredTransactions.reduce((acc, t) => acc + (t.status === 'COMPLETED' ? t.amount : 0), 0);
    const completedCount = filteredTransactions.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">İşlem Geçmişi</h1>
                    <p className="text-gray-400">Tüm geçmiş işlemlerinizi görüntüleyin</p>
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
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="COMPLETED">Tamamlandı</option>
                                <option value="CANCELLED">İptal</option>
                                <option value="REFUNDED">İade</option>
                            </select>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            >
                                <option value="all">Tüm Tarihler</option>
                                <option value="today">Bugün</option>
                                <option value="week">Son 7 Gün</option>
                                <option value="month">Son 30 Gün</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Özet Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <History className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam İşlem</p>
                                <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Gelir</p>
                                <p className="text-2xl font-bold text-white">₺{totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <User className="w-8 h-8 text-purple-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Başarılı İşlem</p>
                                <p className="text-2xl font-bold text-white">{completedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İşlem Listesi */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">İşlem geçmişi yükleniyor...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">İşlem geçmişi bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tarih
                                        </th>
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
                                            Ödeme
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tutar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <div>
                                                        <div>{new Date(transaction.date).toLocaleDateString('tr-TR')}</div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(transaction.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-100">
                                                            {transaction.customerName}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {transaction.customerPhone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-300">{transaction.vehicleInfo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {transaction.serviceType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                                                    {transaction.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-white">
                                                ₺{transaction.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(transaction.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDetails(true);
                                                    }}
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

            {/* İşlem Detayları Modal */}
            {showDetails && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">İşlem Detayları</h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">İşlem ID:</span>
                                        <span className="text-white ml-2">#{selectedTransaction.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Tarih:</span>
                                        <span className="text-white ml-2">
                                            {new Date(selectedTransaction.date).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Saat:</span>
                                        <span className="text-white ml-2">
                                            {new Date(selectedTransaction.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Durum:</span>
                                        <span className="ml-2">{getStatusBadge(selectedTransaction.status)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-2">Müşteri Bilgileri</h4>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <span className="text-gray-400">Ad Soyad:</span>
                                        <span className="text-white ml-2">{selectedTransaction.customerName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Telefon:</span>
                                        <span className="text-white ml-2">{selectedTransaction.customerPhone}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Araç:</span>
                                        <span className="text-white ml-2">{selectedTransaction.vehicleInfo}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-2">Hizmet Detayları</h4>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <span className="text-gray-400">Hizmet:</span>
                                        <span className="text-white ml-2">{selectedTransaction.serviceType}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Tutar:</span>
                                        <span className="text-white ml-2 font-semibold">₺{selectedTransaction.amount.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Ödeme:</span>
                                        <span className="text-white ml-2">{selectedTransaction.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedTransaction.notes && (
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-white mb-2">Notlar</h4>
                                    <p className="text-gray-300 text-sm">{selectedTransaction.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopHistory;

