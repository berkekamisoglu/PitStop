import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Clock,
  Star,
  FileText,
  Settings,
  UserCircle,
  LogOut,
} from 'lucide-react';
import authService from '../services/AuthService';

const Sidebar: React.FC = () => {
    const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Kullanıcı';

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, title: 'Anasayfa' },
    { path: '/vehicles', icon: <Car size={20} />, title: 'Araçlarım' },
    { path: '/appointments', icon: <Calendar size={20} />, title: 'Randevularım' },
    { path: '/favorites', icon: <Star size={20} />, title: 'Favorilerim' },
    { path: '/history', icon: <FileText size={20} />, title: 'Geçmiş' },
    ];

  const isActive = (path: string) => location.pathname === path;

    return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 rounded-full p-2">
            <UserCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-medium truncate">{userName}</h2>
            <p className="text-gray-400 text-sm">Müşteri</p>
          </div>
        </div>
            </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
                ))}
        </ul>
            </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Ayarlar</span>
        </Link>
                <button
          onClick={() => authService.logout()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors mt-2"
                >
                    <LogOut size={20} />
          <span>Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;