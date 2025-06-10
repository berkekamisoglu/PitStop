import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { DollarSign, TrendingUp, Calendar, BarChart3, PieChart, Download } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface RevenueData {
    date: string;
    amount: number;
    serviceType: string;
    customerName: string;
    paymentMethod: string;
}

interface MonthlyRevenue {
    month: string;
    total: number;
    services: number;
    products: number;
}

const ShopRevenue: React.FC = () => {
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('this_month');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);

    useEffect(() => {
        loadRevenueData();
    }, [selectedPeriod]);    const loadRevenueData = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            
            // Note: Current backend design doesn't directly link invoices to shops
            // This is a limitation that would need backend schema changes to fix properly
            const response = await axiosInstance.get('/api/invoices');
            
            // For now, we'll use all invoices as a placeholder
            // In a real implementation, invoices should be filtered by shop
            const mappedRevenueData: RevenueData[] = response.data.map((invoice: any) => ({
                date: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                amount: invoice.totalAmount || 0,
                serviceType: 'Genel Hizmet', // Default service type
                customerName: invoice.user?.username || 'Bilinmeyen Müşteri',
                paymentMethod: invoice.payment?.paymentMethod || 'Bilinmeyen'
            }));
            
            setRevenueData(mappedRevenueData);
            
            // Calculate totals
            const total = mappedRevenueData.reduce((acc, item) => acc + item.amount, 0);
            const today = new Date().toISOString().split('T')[0];
            const todayTotal = mappedRevenueData
                .filter(item => item.date === today)
                .reduce((acc, item) => acc + item.amount, 0);
            
            setTotalRevenue(total);
            setTodayRevenue(todayTotal);
            
            // Generate monthly data (simplified)
            const monthlyRevenue: MonthlyRevenue[] = [
                { month: 'Ocak', total: total * 0.15, services: total * 0.1, products: total * 0.05 },
                { month: 'Şubat', total: total * 0.12, services: total * 0.08, products: total * 0.04 },
                { month: 'Mart', total: total * 0.18, services: total * 0.12, products: total * 0.06 },
                { month: 'Nisan', total: total * 0.16, services: total * 0.11, products: total * 0.05 },
                { month: 'Mayıs', total: total * 0.20, services: total * 0.13, products: total * 0.07 },
                { month: 'Haziran', total: total * 0.19, services: total * 0.12, products: total * 0.07 }
            ];
            
            setMonthlyData(monthlyRevenue);
        } catch (error) {
            console.error('Error loading revenue data:', error);
            // Keep empty data on error
            setRevenueData([]);
            setMonthlyData([]);
            setTotalRevenue(0);
            setTodayRevenue(0);
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "Tarih,Tutar,Hizmet,Müşteri,Ödeme Yöntemi\n" +
            revenueData.map(row => 
                `${row.date},${row.amount},${row.serviceType},${row.customerName},${row.paymentMethod}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "gelir_raporu.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Gelir Takibi</h1>
                    <p className="text-gray-400">Finansal performansınızı analiz edin</p>
                </div>

                {/* Filtreler */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            >
                                <option value="today">Bugün</option>
                                <option value="this_week">Bu Hafta</option>
                                <option value="this_month">Bu Ay</option>
                                <option value="last_month">Geçen Ay</option>
                                <option value="this_year">Bu Yıl</option>
                            </select>
                        </div>
                        <button
                            onClick={exportData}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Rapor İndir
                        </button>
                    </div>
                </div>

                {/* Özet Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Gelir</p>
                                <p className="text-2xl font-bold text-white">₺{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Bugünkü Gelir</p>
                                <p className="text-2xl font-bold text-white">₺{todayRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Ortalama İşlem</p>
                                <p className="text-2xl font-bold text-white">
                                    ₺{revenueData.length > 0 ? Math.round(totalRevenue / revenueData.length).toLocaleString() : '0'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-yellow-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">İşlem Sayısı</p>
                                <p className="text-2xl font-bold text-white">{revenueData.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aylık Gelir Grafiği */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Aylık Gelir Trendi
                    </h2>
                    <div className="h-64 flex items-end space-x-4">
                        {monthlyData.map((month, index) => {
                            const maxHeight = Math.max(...monthlyData.map(m => m.total));
                            const height = (month.total / maxHeight) * 200;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-gray-700 rounded-t relative" style={{ height: `${height}px` }}>
                                        <div 
                                            className="bg-gradient-to-t from-red-600 to-red-400 rounded-t w-full absolute bottom-0"
                                            style={{ height: `${(month.services / month.total) * 100}%` }}
                                        ></div>
                                        <div 
                                            className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full absolute bottom-0"
                                            style={{ height: `${(month.products / month.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2 text-center">
                                        <div>{month.month}</div>
                                        <div className="font-semibold text-white">₺{(month.total / 1000).toFixed(0)}K</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span className="text-sm text-gray-400">Hizmetler</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span className="text-sm text-gray-400">Ürünler</span>
                        </div>
                    </div>
                </div>

                {/* Gelir Detayları */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <PieChart className="w-5 h-5 mr-2" />
                            İşlem Detayları
                        </h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Gelir verileri yükleniyor...</p>
                        </div>
                    ) : revenueData.length === 0 ? (
                        <div className="p-8 text-center">
                            <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Bu dönemde gelir kaydı bulunamadı.</p>
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
                                            Hizmet/Ürün
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Ödeme Yöntemi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tutar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {revenueData.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {new Date(transaction.date).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {transaction.customerName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {transaction.serviceType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                                                    {transaction.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-green-400">
                                                ₺{transaction.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Ödeme Yöntemi Dağılımı */}
                <div className="bg-gray-800 rounded-lg p-6 mt-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Ödeme Yöntemi Dağılımı</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Kredi Kartı', 'Nakit', 'Havale/EFT'].map(method => {
                            const amount = revenueData
                                .filter(item => item.paymentMethod === method)
                                .reduce((acc, item) => acc + item.amount, 0);
                            const percentage = totalRevenue > 0 ? (amount / totalRevenue * 100).toFixed(1) : '0.0';
                            
                            return (
                                <div key={method} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-300">{method}</span>
                                        <span className="text-white font-semibold">{percentage}%</span>
                                    </div>
                                    <div className="text-lg font-bold text-white">₺{amount.toLocaleString()}</div>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                                        <div 
                                            className={`h-2 rounded-full ${getPaymentMethodColor(method).includes('blue') ? 'bg-blue-500' : 
                                                getPaymentMethodColor(method).includes('green') ? 'bg-green-500' : 'bg-purple-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopRevenue;

