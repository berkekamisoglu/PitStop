import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { Wrench, Plus, Edit2, Trash2, Search, DollarSign, Tag } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface ServiceItem {
    id: number;
    serviceName: string;
    price: number;
}

const ShopServices: React.FC = () => {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);
    const [newService, setNewService] = useState<Partial<ServiceItem>>({
        serviceName: '',
        price: 0
    });
    const [error, setError] = useState('');

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            const response = await axiosInstance.get(`/api/tire-shop-services/shop/${shopId}`);
            setServices(response.data);
        } catch (error) {
            console.error('Error loading services:', error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const addService = async () => {
        try {
            setError('');
            const shopId = localStorage.getItem('userId');
            
            if (!newService.serviceName || !newService.price) {
                setError('Lütfen tüm alanları doldurun');
                return;
            }

            const serviceData = {
                serviceName: newService.serviceName,
                price: newService.price,
                tireShop: {
                    id: parseInt(shopId!)
                }
            };

            await axiosInstance.post('/api/tire-shop-services', serviceData);
            await loadServices();
            
            setShowAddModal(false);
            setNewService({
                serviceName: '',
                price: 0
            });
            setError('');
        } catch (error) {
            console.error('Error adding service:', error);
            setError('Hizmet eklenirken bir hata oluştu');
        }
    };

    const updateService = async () => {
        try {
            setError('');
            const shopId = localStorage.getItem('userId');
            
            if (!editingService || !editingService.serviceName || !editingService.price) {
                setError('Lütfen tüm alanları doldurun');
                return;
            }

            const serviceData = {
                serviceName: editingService.serviceName,
                price: editingService.price,
                tireShop: {
                    id: parseInt(shopId!)
                }
            };

            await axiosInstance.put(`/api/tire-shop-services/${editingService.id}`, serviceData);
            await loadServices();
            
            setEditingService(null);
            setError('');
        } catch (error) {
            console.error('Error updating service:', error);
            setError('Hizmet güncellenirken bir hata oluştu');
        }
    };

    const deleteService = async (serviceId: number) => {
        if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/tire-shop-services/${serviceId}`);
            await loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Hizmet silinirken bir hata oluştu');
        }
    };

    const filteredServices = services.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-900">
                <ShopSidebar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900">
            <ShopSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-600 p-3 rounded-full">
                                <Wrench className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Hizmet Yönetimi</h1>
                                <p className="text-gray-400">Sunduğunuz hizmetleri yönetin</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Yeni Hizmet</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Hizmet ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Hizmetler ({filteredServices.length})
                            </h2>
                            
                            {filteredServices.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wrench className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">
                                        {searchTerm ? 'Arama kriterinize uygun hizmet bulunamadı' : 'Henüz hizmet eklenmemiş'}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                                        >
                                            İlk Hizmeti Ekle
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Hizmet Adı
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Fiyat
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                            {filteredServices.map((service) => (
                                                <tr key={service.id} className="hover:bg-gray-750">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Tag className="h-5 w-5 text-red-400 mr-3" />
                                                            <span className="text-white font-medium">
                                                                {service.serviceName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                                                            <span className="text-white">
                                                                ₺{service.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-end">
                                                            <button
                                                                onClick={() => setEditingService(service)}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-gray-700"
                                                                title="Düzenle"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteService(service.id)}
                                                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-gray-700"
                                                                title="Sil"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
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

                {/* Add Service Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Yeni Hizmet Ekle</h2>
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Hizmet Adı *
                                    </label>
                                    <input
                                        type="text"
                                        value={newService.serviceName || ''}
                                        onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="örn: Lastik Değişimi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Fiyat (₺) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newService.price || ''}
                                        onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-8">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewService({ serviceName: '', price: 0 });
                                        setError('');
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={addService}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                                >
                                    Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Service Modal */}
                {editingService && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Hizmet Düzenle</h2>
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Hizmet Adı *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingService.serviceName}
                                        onChange={(e) => setEditingService({ ...editingService, serviceName: e.target.value })}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="örn: Lastik Değişimi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Fiyat (₺) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editingService.price}
                                        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-8">
                                <button
                                    onClick={() => {
                                        setEditingService(null);
                                        setError('');
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={updateService}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                                >
                                    Güncelle
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopServices;

