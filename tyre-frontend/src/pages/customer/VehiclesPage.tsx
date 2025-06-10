import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Edit2, Trash2, Settings, X } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface TireSize {
    id: number;
    size: string;
}

interface VehicleType {
    id: number;
    typeName: string;
}

interface Vehicle {
    id: number;
    licensePlate: string;
    brand: string;
    model: string;
    vehicleType: VehicleType;
    tireSize: TireSize;
}

const VehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [newVehicle, setNewVehicle] = useState({
        licensePlate: '',
        brand: '',
        model: '',
        vehicleTypeId: 0,
        tireSizeId: 0
    });
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [tireSizes, setTireSizes] = useState<TireSize[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axiosInstance.get('/api/user-vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error('Araçlar yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tireSizesResponse, vehicleTypesResponse] = await Promise.all([
                    axiosInstance.get('/api/tire-sizes'),
                    axiosInstance.get('/api/vehicle-types')
                ]);
                setTireSizes(tireSizesResponse.data);
                setVehicleTypes(vehicleTypesResponse.data);
            } catch (error) {
                console.error('Veriler yüklenirken hata:', error);
                setError('Veriler yüklenirken bir hata oluştu.');
            }
        };

        if (isModalOpen) {
            fetchData();
            if (selectedVehicle) {
                setNewVehicle({
                    licensePlate: selectedVehicle.licensePlate,
                    brand: selectedVehicle.brand,
                    model: selectedVehicle.model,
                    vehicleTypeId: selectedVehicle.vehicleType?.id || 0,
                    tireSizeId: selectedVehicle.tireSize?.id || 0
                });
            }
        } else {
            setSelectedVehicle(null);
            setNewVehicle({
                licensePlate: '',
                brand: '',
                model: '',
                vehicleTypeId: 0,
                tireSizeId: 0
            });
        }
    }, [isModalOpen, selectedVehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newVehicle.licensePlate || !newVehicle.brand || !newVehicle.model || !newVehicle.vehicleTypeId || !newVehicle.tireSizeId) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        setCreating(true);
        setError('');

        try {
          const vehicleData = {
                licensePlate: newVehicle.licensePlate.trim(),
                brand: newVehicle.brand.trim(),
                model: newVehicle.model.trim(),
                vehicleType: { id: newVehicle.vehicleTypeId },
            tireSize: { id: newVehicle.tireSizeId }
        };
        
            if (selectedVehicle) {
                const response = await axiosInstance.put<Vehicle>(`/api/user-vehicles/${selectedVehicle.id}`, vehicleData);
                setVehicles(prevVehicles => 
                    prevVehicles.map(vehicle => 
                        vehicle.id === selectedVehicle.id ? response.data : vehicle
                    )
                );
            } else {
                const response = await axiosInstance.post<Vehicle>('/api/user-vehicles', vehicleData);
                setVehicles(prevVehicles => [...prevVehicles, response.data]);
            }
            
            setIsModalOpen(false);
            setSelectedVehicle(null);
            setNewVehicle({
                licensePlate: '',
                brand: '',
                model: '',
                vehicleTypeId: 0,
                tireSizeId: 0
            });
        } catch (error: any) {
            console.error('Araç işlemi sırasında hata:', error);
            setError(error.response?.data?.message || 'İşlem sırasında bir hata oluştu.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
            try {
                await axiosInstance.delete(`/api/user-vehicles/${id}`);
                setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            } catch (error) {
                console.error('Araç silinirken hata:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Araçlarım</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Araç Ekle
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Car className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Henüz araç eklemediniz</h3>
                        <p className="text-gray-400 mb-6">İlk aracınızı ekleyerek başlayın</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Yeni Araç Ekle
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Car className="w-5 h-5 text-red-500 mr-2" />
                                        <h3 className="text-lg font-medium text-gray-200">
                                            {vehicle.brand} {vehicle.model}
                                        </h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                        onClick={() => {
                                                if (vehicle.vehicleType && vehicle.tireSize) {
                                                    setNewVehicle({
                                                        licensePlate: vehicle.licensePlate,
                                                        brand: vehicle.brand,
                                                        model: vehicle.model,
                                                        vehicleTypeId: vehicle.vehicleType.id,
                                                        tireSizeId: vehicle.tireSize.id
                                                    });
                                            setSelectedVehicle(vehicle);
                                            setIsModalOpen(true);
                                                }
                                        }}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            title="Düzenle"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400">Araç Tipi</span>
                                        <span className="text-white">{vehicle.vehicleType?.typeName || '—'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400">Plaka</span>
                                        <span className="text-white">{vehicle.licensePlate}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400">Lastik Ebatı</span>
                                        <span className="text-white">{vehicle.tireSize?.size || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {selectedVehicle ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Marka
                                </label>
                                <input
                                    type="text"
                                    value={newVehicle.brand}
                                    onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Örn: BMW"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Model
                                </label>
                                <input
                                    type="text"
                                    value={newVehicle.model}
                                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Örn: 320i"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Araç Tipi
                                </label>
                                <select
                                    value={newVehicle.vehicleTypeId}
                                    onChange={(e) => setNewVehicle({...newVehicle, vehicleTypeId: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">Araç tipi seçin</option>
                                    {vehicleTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.typeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Plaka
                                </label>
                                <input
                                    type="text"
                                    value={newVehicle.licensePlate}
                                    onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value.toUpperCase()})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Örn: 34ABC123"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Lastik Boyutu
                                </label>
                                <select
                                    value={newVehicle.tireSizeId}
                                    onChange={(e) => setNewVehicle({...newVehicle, tireSizeId: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">Lastik boyutu seçin</option>
                                    {tireSizes.map((size) => (
                                        <option key={size.id} value={size.id}>
                                            {size.size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedVehicle(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    {creating ? 'Kaydediliyor...' : selectedVehicle ? 'Güncelle' : 'Araç Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclesPage;

