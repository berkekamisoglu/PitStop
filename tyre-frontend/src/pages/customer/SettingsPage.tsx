import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { 
    Settings, 
    Bell, 
    Smartphone, 
    Mail, 
    MessageSquare, 
    Globe, 
    Palette, 
    Clock, 
    Shield, 
    User, 
    Lock,
    Eye,
    EyeOff,
    Save,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Download
} from 'lucide-react';

interface UserSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    language: 'tr' | 'en';
    theme: 'light' | 'dark';
    timezone: string;
}

interface UserProfile {
    name: string;
    email: string;
    phone: string;
}

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings>({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        language: 'tr',
        theme: 'dark',
        timezone: 'Europe/Istanbul'
    });
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 555 123 4567'
    });
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            // await axiosInstance.put('/api/users/settings', settings);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        if (passwords.new.length < 6) {
            alert('Şifre en az 6 karakter olmalıdır!');
            return;
        }
        
        try {
            // Simulate password change
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Şifre başarıyla değiştirildi!');
            setShowPasswordChange(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            alert('Şifre değiştirirken hata oluştu!');
        }
    };

    const getSaveButtonText = () => {
        switch (saveStatus) {
            case 'saving':
                return 'Kaydediliyor...';
            case 'saved':
                return 'Kaydedildi!';
            case 'error':
                return 'Hata Oluştu!';
            default:
                return 'Değişiklikleri Kaydet';
        }
    };

    const getSaveButtonIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>;
            case 'saved':
                return <CheckCircle className="w-4 h-4" />;
            case 'error':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <Save className="w-4 h-4" />;
        }
    };

    const getSaveButtonColor = () => {
        switch (saveStatus) {
            case 'saving':
                return 'bg-gray-600 cursor-not-allowed';
            case 'saved':
                return 'bg-green-600 hover:bg-green-700';
            case 'error':
                return 'bg-red-600 hover:bg-red-700';
            default:
                return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-500 border-r-purple-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
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
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                                ⚙️ Ayarlar
                            </h1>
                            <p className="text-gray-300 mt-2">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
                        </div>
                        
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed flex items-center space-x-2 ${getSaveButtonColor()}`}
                        >
                            {getSaveButtonIcon()}
                            <span>{getSaveButtonText()}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-3">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Profil Bilgileri</h2>
                                    <p className="text-gray-400">Kişisel bilgilerinizi yönetin</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Ad Soyad
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    className="w-full mt-6 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>Şifre Değiştir</span>
                                </button>

                                {showPasswordChange && (
                                    <div className="mt-4 space-y-4 p-4 bg-gray-800/30 rounded-xl border border-gray-600/30">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Mevcut Şifre
                                            </label>
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwords.current}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                                className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                                            >
                                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Yeni Şifre
                                            </label>
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwords.new}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                                className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                                            >
                                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Yeni Şifre (Tekrar)
                                            </label>
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                                className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handlePasswordChange}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                            >
                                                Şifreyi Değiştir
                                            </button>
                                            <button
                                                onClick={() => setShowPasswordChange(false)}
                                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Notification Settings */}
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-3">
                                    <Bell className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Bildirim Ayarları</h2>
                                    <p className="text-gray-400">Hangi bildirimleri almak istediğinizi seçin</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                    <div className="flex items-center space-x-4">
                                        <Mail className="w-6 h-6 text-blue-400" />
                                        <div>
                                            <h3 className="font-semibold text-white">E-posta Bildirimleri</h3>
                                            <p className="text-sm text-gray-400">Randevu hatırlatmaları ve güncellemeler</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                emailNotifications: e.target.checked
                                            }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                    <div className="flex items-center space-x-4">
                                        <Smartphone className="w-6 h-6 text-green-400" />
                                        <div>
                                            <h3 className="font-semibold text-white">Push Bildirimleri</h3>
                                            <p className="text-sm text-gray-400">Anlık bildirimler ve uyarılar</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.pushNotifications}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                pushNotifications: e.target.checked
                                            }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                    <div className="flex items-center space-x-4">
                                        <MessageSquare className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <h3 className="font-semibold text-white">SMS Bildirimleri</h3>
                                            <p className="text-sm text-gray-400">SMS ile randevu hatırlatmaları</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.smsNotifications}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                smsNotifications: e.target.checked
                                            }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-orange-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* App Settings */}
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3">
                                    <Settings className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Uygulama Ayarları</h2>
                                    <p className="text-gray-400">Dil, tema ve diğer tercihleriniz</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300 mb-3">
                                        <Globe className="w-5 h-5 text-blue-400" />
                                        <span>Dil</span>
                                    </label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            language: e.target.value as 'tr' | 'en'
                                        }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    >
                                        <option value="tr">🇹🇷 Türkçe</option>
                                        <option value="en">🇺🇸 English</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300 mb-3">
                                        <Palette className="w-5 h-5 text-purple-400" />
                                        <span>Tema</span>
                                    </label>
                                    <select
                                        value={settings.theme}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            theme: e.target.value as 'light' | 'dark'
                                        }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    >
                                        <option value="dark">🌙 Koyu Tema</option>
                                        <option value="light">☀️ Açık Tema</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300 mb-3">
                                        <Clock className="w-5 h-5 text-green-400" />
                                        <span>Saat Dilimi</span>
                                    </label>
                                    <select
                                        value={settings.timezone}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            timezone: e.target.value
                                        }))}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    >
                                        <option value="Europe/Istanbul">🇹🇷 İstanbul (UTC+03:00)</option>
                                        <option value="Europe/London">🇬🇧 Londra (UTC+01:00)</option>
                                        <option value="America/New_York">🇺🇸 New York (UTC-04:00)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Security */}
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-3">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Gizlilik ve Güvenlik</h2>
                                    <p className="text-gray-400">Veri ve hesap güvenliği ayarları</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 px-4 py-3 rounded-xl border border-blue-600/30 hover:border-blue-500/50 transition-all duration-200 flex items-center justify-center space-x-2">
                                    <Download className="w-5 h-5" />
                                    <span>Verilerimi İndir</span>
                                </button>

                                <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 px-4 py-3 rounded-xl border border-red-600/30 hover:border-red-500/50 transition-all duration-200 flex items-center justify-center space-x-2">
                                    <Trash2 className="w-5 h-5" />
                                    <span>Hesabı Sil</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

