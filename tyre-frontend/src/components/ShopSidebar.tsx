import React, { ReactElement } from 'react';
import { Home, Calendar, Settings, LogOut, History, Star, Users, Package, DollarSign, Wrench } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../services/AuthService';

interface MenuItem {
    icon: ReactElement;
    text: string;
    path: string;
}

const ShopSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems: MenuItem[] = [
        { icon: <Home size={20} />, text: 'Ana Sayfa', path: '/shop-dashboard' },
        { icon: <Calendar size={20} />, text: 'Randevular', path: '/shop-appointments' },
        { icon: <Users size={20} />, text: 'Müşteriler', path: '/shop-customers' },
        { icon: <Package size={20} />, text: 'Stok Yönetimi', path: '/shop-inventory' },
        { icon: <DollarSign size={20} />, text: 'Gelir Takibi', path: '/shop-revenue' },
        { icon: <Wrench size={20} />, text: 'Hizmetler', path: '/shop-services' },
        { icon: <History size={20} />, text: 'İşlem Geçmişi', path: '/shop-history' },
        { icon: <Star size={20} />, text: 'Değerlendirmeler', path: '/shop-reviews' },
        { icon: <Settings size={20} />, text: 'Ayarlar', path: '/shop-settings' },
    ];

    const handleLogout = (): void => {
        authService.logout();
    };

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <div className="w-64 bg-gray-800 border-r border-gray-700 shadow-lg h-screen">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-500">PITSTOP</h1>
                <p className="text-sm text-gray-400 mt-1">Servis Paneli</p>
            </div>

            <nav className="mt-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center px-6 py-3 w-full transition-colors text-left ${
                            isActive(item.path)
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-red-500'
                        }`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.text}</span>
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-0 w-64 p-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-300 hover:text-red-500 w-full transition-colors"
                >
                    <LogOut size={20} />
                    <span className="ml-3">Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
};

export default ShopSidebar; 