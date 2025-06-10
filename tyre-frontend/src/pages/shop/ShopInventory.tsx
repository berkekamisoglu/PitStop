import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { Package, Search, Plus, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface InventoryItem {
    id: number;
    name: string;
    brand: string;
    model: string;
    size: string;
    quantity: number;
    minQuantity: number;
    price: number;
    category: string;
    description?: string;
    lastUpdated: string;
}

const ShopInventory: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
        name: '',
        brand: '',
        model: '',
        size: '',
        quantity: 0,
        minQuantity: 5,
        price: 0,
        category: 'tires',
        description: ''
    });    const categories = [
        { value: 'all', label: 'Tüm Kategoriler' },
        { value: 'tires', label: 'Lastikler' },
        { value: 'wheels', label: 'Jantlar' }
    ];useEffect(() => {
        loadInventory();
    }, []);    // Helper function to determine category based on product name/model
    const determineCategory = (brand: string, model: string): string => {
        const productText = `${brand} ${model}`.toLowerCase();
        
        // Check for wheel/rim keywords (Jantlar)
        if (productText.includes('jant') || productText.includes('rim') || 
            productText.includes('wheel') || productText.includes('felge') ||
            productText.includes('alu') || productText.includes('alloy')) {
            return 'wheels';
        }
        
        // Default to tires (Lastikler)
        return 'tires';
    };

    const loadInventory = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            const response = await axiosInstance.get(`/api/tire-stock/shop/${shopId}`);
            
            // Map TireStock data to InventoryItem format
            const mappedInventory: InventoryItem[] = response.data.map((stock: any) => ({
                id: stock.id,
                name: `${stock.tire.brand} ${stock.tire.model}`,
                brand: stock.tire.brand,
                model: stock.tire.model,
                size: stock.tire.tireSize.size,
                quantity: stock.stockQuantity,
                minQuantity: 5, // Default minimum quantity
                price: stock.tire.price,
                category: determineCategory(stock.tire.brand, stock.tire.model),
                description: `${stock.tire.brand} ${stock.tire.model} - ${stock.tire.tireSize.size}`,
                lastUpdated: new Date().toISOString()
            }));
            
            setInventory(mappedInventory);
        } catch (error) {
            console.error('Error loading inventory:', error);
            // Keep empty inventory on error
            setInventory([]);
        } finally {
            setLoading(false);
        }
    };    const addItem = async () => {
        try {
            const shopId = localStorage.getItem('userId');
            
            // Step 1: Create or find the tire
            // First, we need to check if a tire with this brand/model already exists
            // For now, we'll create a new tire entry
            const tireData = {
                brand: newItem.brand,
                model: newItem.model,
                price: newItem.price,
                tireSize: {
                    size: newItem.size
                }
            };
            
            // Create tire first
            const tireResponse = await axiosInstance.post('/api/tires', tireData);
            const createdTire = tireResponse.data;
            
            // Step 2: Create tire stock entry
            const stockData = {
                tire: {
                    id: createdTire.id
                },
                tireShop: {
                    id: parseInt(shopId!)
                },
                stockQuantity: newItem.quantity
            };
            
            const stockResponse = await axiosInstance.post('/api/tire-stock', stockData);
            
            // Reload inventory to get updated data from server
            await loadInventory();
            
            setShowAddModal(false);
            setNewItem({
                name: '',
                brand: '',
                model: '',
                size: '',
                quantity: 0,
                minQuantity: 5,
                price: 0,
                category: 'tires',
                description: ''
            });
            
            alert('Ürün başarıyla eklendi!');
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Ürün eklenirken hata oluştu. Lütfen tüm alanları doldurun.');
        }
    };    const updateItem = async (item: InventoryItem) => {
        try {
            // Update the tire stock quantity
            const stockData = {
                stockQuantity: item.quantity
            };
            
            await axiosInstance.put(`/api/tire-stock/${item.id}`, stockData);
            
            // Reload inventory to get updated data from server
            await loadInventory();
            setEditingItem(null);
            
            alert('Ürün başarıyla güncellendi!');
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Ürün güncellenirken hata oluştu.');
        }
    };    const deleteItem = async (itemId: number) => {
        if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        
        try {
            await axiosInstance.delete(`/api/tire-stock/${itemId}`);
            
            // Reload inventory to get updated data from server
            await loadInventory();
            
            alert('Ürün başarıyla silindi!');
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Ürün silinirken hata oluştu.');
        }
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.size.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) {
            return <span className="px-2 py-1 text-xs rounded-full bg-red-900 text-red-300">Tükendi</span>;
        } else if (item.quantity <= item.minQuantity) {
            return <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">Düşük</span>;
        } else {
            return <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Normal</span>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Stok Yönetimi</h1>
                    <p className="text-gray-400">Envanter durumunuzu takip edin ve yönetin</p>
                </div>

                {/* Düşük Stok Uyarısı */}
                {lowStockItems.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                            <h3 className="text-yellow-400 font-semibold">Düşük Stok Uyarısı</h3>
                        </div>
                        <p className="text-yellow-300 text-sm mt-1">
                            {lowStockItems.length} ürününde stok azalığı var.
                        </p>
                    </div>
                )}

                {/* Filtreler ve Yeni Ürün Ekleme */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Ürün adı, marka, model veya ebat ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Ürün
                        </button>
                    </div>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Ürün</p>
                                <p className="text-2xl font-bold text-white">{inventory.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Stokta Var</p>
                                <p className="text-2xl font-bold text-white">
                                    {inventory.filter(i => i.quantity > i.minQuantity).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Düşük Stok</p>
                                <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-purple-500" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-400">Toplam Değer</p>
                                <p className="text-2xl font-bold text-white">
                                    ₺{inventory.reduce((acc, item) => acc + (item.quantity * item.price), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stok Listesi */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Stok verileri yükleniyor...</p>
                        </div>
                    ) : filteredInventory.length === 0 ? (
                        <div className="p-8 text-center">
                            <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Ürün bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Ürün
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Stok
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Fiyat
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
                                    {filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-100">
                                                        {item.brand} {item.model}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {item.size} - {item.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {categories.find(c => c.value === item.category)?.label}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div>Mevcut: {item.quantity}</div>
                                                    <div className="text-xs text-gray-400">
                                                        Min: {item.minQuantity}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                ₺{item.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStockStatus(item)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
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

            {/* Yeni Ürün Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold text-white mb-4">Yeni Ürün Ekle</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ürün Adı"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Marka"
                                    value={newItem.brand}
                                    onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Model"
                                    value={newItem.model}
                                    onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Ebat/Boyut"
                                value={newItem.size}
                                onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                                {categories.slice(1).map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}                            </select>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Miktar</label>
                                    <input
                                        type="number"
                                        placeholder="Miktar"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Min Stok</label>
                                    <input
                                        type="number"
                                        placeholder="Min Stok"
                                        value={newItem.minQuantity}
                                        onChange={(e) => setNewItem({ ...newItem, minQuantity: parseInt(e.target.value) || 0 })}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        placeholder="Fiyat"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                            </div>
                            <textarea
                                placeholder="Açıklama"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                İptal
                            </button>
                            <button
                                onClick={addItem}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Düzenleme Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold text-white mb-4">Ürün Düzenle</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ürün Adı"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Marka"
                                    value={editingItem.brand}
                                    onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Model"
                                    value={editingItem.model}
                                    onChange={(e) => setEditingItem({ ...editingItem, model: e.target.value })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Ebat/Boyut"
                                value={editingItem.size}
                                onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                                {categories.slice(1).map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="number"
                                    placeholder="Miktar"
                                    value={editingItem.quantity}
                                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Stok"
                                    value={editingItem.minQuantity}
                                    onChange={(e) => setEditingItem({ ...editingItem, minQuantity: parseInt(e.target.value) || 0 })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Fiyat"
                                    value={editingItem.price}
                                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <textarea
                                placeholder="Açıklama"
                                value={editingItem.description || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => updateItem(editingItem)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopInventory;

