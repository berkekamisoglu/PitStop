import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { 
    Settings, User, MapPin, Clock, Phone, Mail, Camera, 
    Save, Bell, Shield, CreditCard, Globe, Palette,
    Eye, EyeOff, Edit3, Check, X
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface ShopProfile {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    district: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    coverImage?: string;
    workingHours: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };
}

interface NotificationSettings {
    email: {
        newAppointments: boolean;
        appointmentReminders: boolean;
        newReviews: boolean;
        promotions: boolean;
    };
    sms: {
        newAppointments: boolean;
        appointmentReminders: boolean;
        emergencyAlerts: boolean;
    };
    push: {
        newMessages: boolean;
        appointmentUpdates: boolean;
        systemUpdates: boolean;
    };
}

interface SecuritySettings {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    passwordLastChanged: string;
}

const ShopSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    
    // Profile Settings
    const [profile, setProfile] = useState<ShopProfile>({
        id: 1,
        name: '',
        description: '',
        address: '',
        city: '',
        district: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        coverImage: '',
        workingHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: true }
        }
    });

    // Notification Settings
    const [notifications, setNotifications] = useState<NotificationSettings>({
        email: {
            newAppointments: true,
            appointmentReminders: true,
            newReviews: true,
            promotions: false
        },
        sms: {
            newAppointments: true,
            appointmentReminders: true,
            emergencyAlerts: true
        },
        push: {
            newMessages: true,
            appointmentUpdates: true,
            systemUpdates: false
        }
    });

    // Security Settings
    const [security, setSecurity] = useState<SecuritySettings>({
        twoFactorAuth: false,
        loginAlerts: true,
        passwordLastChanged: '2024-05-15T10:30:00Z'
    });

    // Password Change
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const daysOfWeek = [
        { key: 'monday', label: 'Pazartesi' },
        { key: 'tuesday', label: 'Salı' },
        { key: 'wednesday', label: 'Çarşamba' },
        { key: 'thursday', label: 'Perşembe' },
        { key: 'friday', label: 'Cuma' },
        { key: 'saturday', label: 'Cumartesi' },
        { key: 'sunday', label: 'Pazar' }
    ];

    useEffect(() => {
        loadSettings();
    }, []);    const loadSettings = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            
            // Load tire shop data - using existing tire shop endpoint
            const tireShopResponse = await axiosInstance.get(`/api/tireshops/${shopId}`);
            const tireShopData = tireShopResponse.data;
            
            // Map TireShop data to ShopProfile format
            setProfile({
                id: tireShopData.id,
                name: tireShopData.shopName || '',
                description: '', // Not available in backend TireShop entity yet
                address: tireShopData.address || '',
                city: '', // Not separately available
                district: '', // Not separately available  
                phone: tireShopData.phone || '',
                email: tireShopData.email || '',
                website: '', // Not available in backend yet
                logo: '', // Not available in backend yet
                coverImage: '', // Not available in backend yet
                workingHours: {
                    monday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '18:00', 
                        closed: false 
                    },
                    tuesday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '18:00', 
                        closed: false 
                    },
                    wednesday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '18:00', 
                        closed: false 
                    },
                    thursday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '18:00', 
                        closed: false 
                    },
                    friday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '18:00', 
                        closed: false 
                    },
                    saturday: { 
                        open: tireShopData.openingHour || '09:00', 
                        close: tireShopData.closingHour || '17:00', 
                        closed: false 
                    },
                    sunday: { 
                        open: tireShopData.openingHour || '10:00', 
                        close: tireShopData.closingHour || '16:00', 
                        closed: true 
                    }
                }
            });
            
            // For now, keep default values for notifications and security
            // These would need separate backend entities/endpoints
            
        } catch (error) {
            console.error('Error loading settings:', error);
            // Fallback to empty data instead of demo data for real integration
            setProfile({
                id: 0,
                name: '',
                description: '',
                address: '',
                city: '',
                district: '',
                phone: '',
                email: '',
                website: '',
                logo: '',
                coverImage: '',
                workingHours: {
                    monday: { open: '09:00', close: '18:00', closed: false },
                    tuesday: { open: '09:00', close: '18:00', closed: false },
                    wednesday: { open: '09:00', close: '18:00', closed: false },
                    thursday: { open: '09:00', close: '18:00', closed: false },
                    friday: { open: '09:00', close: '18:00', closed: false },
                    saturday: { open: '09:00', close: '17:00', closed: false },
                    sunday: { open: '10:00', close: '16:00', closed: true }
                }
            });
        } finally {
            setLoading(false);
        }
    };    const saveProfile = async () => {
        try {
            setSaving(true);
            
            // Map ShopProfile data back to TireShop format
            const tireShopData = {
                id: profile.id,
                shopName: profile.name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                openingHour: profile.workingHours.monday.open, // Using Monday as default
                closingHour: profile.workingHours.monday.close, // Using Monday as default
                // password field should be handled separately
                // latitude and longitude should be preserved from existing data
            };
            
            await axiosInstance.put(`/api/tireshops/${profile.id}`, tireShopData);
            alert('Profil bilgileri başarıyla güncellendi!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Profil güncellenirken hata oluştu!');
        } finally {
            setSaving(false);
        }
    };    const saveNotifications = async () => {
        try {
            setSaving(true);
            // Note: Notification settings are not yet supported by the backend
            // This would require separate entity/table for user preferences
            alert('Bildirim ayarları başarıyla güncellendi! (Not: Bu özellik henüz backend tarafında desteklenmiyor)');
        } catch (error) {
            console.error('Error saving notifications:', error);
            alert('Bildirim ayarları güncellenirken hata oluştu!');
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            alert('Yeni şifre en az 8 karakter olmalı!');
            return;
        }

        try {
            setSaving(true);
            // Note: Password change would need dedicated endpoint in TireShopController
            // For now, we would need to get current tire shop data, update password field, and save
            const currentShopData = await axiosInstance.get(`/api/tireshops/${profile.id}`);
            const updatedShopData = {
                ...currentShopData.data,
                password: passwordForm.newPassword // Note: Should be hashed on backend
            };
            
            await axiosInstance.put(`/api/tireshops/${profile.id}`, updatedShopData);
            
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSecurity(prev => ({ ...prev, passwordLastChanged: new Date().toISOString() }));
            alert('Şifre başarıyla değiştirildi!');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Şifre değiştirilirken hata oluştu!');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <ShopSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white text-xl">Ayarlar yükleniyor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <ShopSidebar />
            
            <div className="flex-1 p-6 ml-64">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <Settings className="inline-block w-8 h-8 mr-3" />
                        İşletme Ayarları
                    </h1>
                    <p className="text-gray-300">
                        İşletmenizin profil, bildirim ve güvenlik ayarlarını yönetin
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-gray-800 rounded-xl mb-8">
                    <div className="flex border-b border-gray-700">
                        {[
                            { key: 'profile', label: 'Profil Bilgileri', icon: User },
                            { key: 'notifications', label: 'Bildirimler', icon: Bell },
                            { key: 'security', label: 'Güvenlik', icon: Shield },
                            { key: 'billing', label: 'Faturalandırma', icon: CreditCard }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                                    activeTab === tab.key
                                        ? 'text-blue-400 border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            İşletme Adı
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Telefon
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={profile.website}
                                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Açıklama
                                    </label>
                                    <textarea
                                        value={profile.description}
                                        onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Şehir
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.city}
                                            onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            İlçe
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.district}
                                            onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Adres
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Çalışma Saatleri</h3>
                                    <div className="space-y-3">
                                        {daysOfWeek.map((day) => (
                                            <div key={day.key} className="flex items-center space-x-4">
                                                <div className="w-24">
                                                    <span className="text-gray-300 text-sm">{day.label}</span>
                                                </div>
                                                
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!profile.workingHours[day.key as keyof typeof profile.workingHours].closed}
                                                        onChange={(e) => setProfile(prev => ({
                                                            ...prev,
                                                            workingHours: {
                                                                ...prev.workingHours,
                                                                [day.key]: {
                                                                    ...prev.workingHours[day.key as keyof typeof prev.workingHours],
                                                                    closed: !e.target.checked
                                                                }
                                                            }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-gray-300 text-sm">Açık</span>
                                                </label>

                                                {!profile.workingHours[day.key as keyof typeof profile.workingHours].closed && (
                                                    <>
                                                        <input
                                                            type="time"
                                                            value={profile.workingHours[day.key as keyof typeof profile.workingHours].open}
                                                            onChange={(e) => setProfile(prev => ({
                                                                ...prev,
                                                                workingHours: {
                                                                    ...prev.workingHours,
                                                                    [day.key]: {
                                                                        ...prev.workingHours[day.key as keyof typeof prev.workingHours],
                                                                        open: e.target.value
                                                                    }
                                                                }
                                                            }))}
                                                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                                                        />
                                                        <span className="text-gray-400">-</span>
                                                        <input
                                                            type="time"
                                                            value={profile.workingHours[day.key as keyof typeof profile.workingHours].close}
                                                            onChange={(e) => setProfile(prev => ({
                                                                ...prev,
                                                                workingHours: {
                                                                    ...prev.workingHours,
                                                                    [day.key]: {
                                                                        ...prev.workingHours[day.key as keyof typeof prev.workingHours],
                                                                        close: e.target.value
                                                                    }
                                                                }
                                                            }))}
                                                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={saveProfile}
                                        disabled={saving}
                                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Kaydediliyor...' : 'Profili Kaydet'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Mail className="w-5 h-5 mr-2" />
                                        E-posta Bildirimleri
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(notifications.email).map(([key, value]) => (
                                            <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <span className="text-gray-300">
                                                    {key === 'newAppointments' && 'Yeni randevular'}
                                                    {key === 'appointmentReminders' && 'Randevu hatırlatmaları'}
                                                    {key === 'newReviews' && 'Yeni değerlendirmeler'}
                                                    {key === 'promotions' && 'Promosyon ve kampanyalar'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setNotifications(prev => ({
                                                        ...prev,
                                                        email: { ...prev.email, [key]: e.target.checked }
                                                    }))}
                                                    className="h-4 w-4"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Phone className="w-5 h-5 mr-2" />
                                        SMS Bildirimleri
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(notifications.sms).map(([key, value]) => (
                                            <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <span className="text-gray-300">
                                                    {key === 'newAppointments' && 'Yeni randevular'}
                                                    {key === 'appointmentReminders' && 'Randevu hatırlatmaları'}
                                                    {key === 'emergencyAlerts' && 'Acil durum uyarıları'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setNotifications(prev => ({
                                                        ...prev,
                                                        sms: { ...prev.sms, [key]: e.target.checked }
                                                    }))}
                                                    className="h-4 w-4"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={saveNotifications}
                                        disabled={saving}
                                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Kaydediliyor...' : 'Bildirimleri Kaydet'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Şifre Güvenliği</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-300">Son şifre değişikliği:</p>
                                            <p className="text-sm text-gray-400">{formatDate(security.passwordLastChanged)}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Şifre Değiştir
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">İki Faktörlü Doğrulama</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-300">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
                                            <p className="text-sm text-gray-400">
                                                {security.twoFactorAuth ? 'Etkin' : 'Devre dışı'}
                                            </p>
                                        </div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={security.twoFactorAuth}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                                                className="h-4 w-4 mr-2"
                                            />
                                            <span className="text-gray-300">Etkinleştir</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Oturum Açma Uyarıları</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-300">Yeni oturum açma işlemlerinde bilgilendirilme</p>
                                            <p className="text-sm text-gray-400">
                                                {security.loginAlerts ? 'Etkin' : 'Devre dışı'}
                                            </p>
                                        </div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={security.loginAlerts}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                                                className="h-4 w-4 mr-2"
                                            />
                                            <span className="text-gray-300">Etkinleştir</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Mevcut Plan</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-semibold text-green-400">Profesyonel Plan</p>
                                            <p className="text-gray-300">Aylık ₺99.00</p>
                                            <p className="text-sm text-gray-400">Sonraki fatura: 15 Temmuz 2024</p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Planı Değiştir
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Ödeme Yöntemi</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-300">**** **** **** 1234</p>
                                            <p className="text-sm text-gray-400">Son kullanma: 12/25</p>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
                                            Güncelle
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">Fatura Geçmişi</h3>
                                    <div className="space-y-3">
                                        {[
                                            { date: '15 Haziran 2024', amount: '₺99.00', status: 'Ödendi' },
                                            { date: '15 Mayıs 2024', amount: '₺99.00', status: 'Ödendi' },
                                            { date: '15 Nisan 2024', amount: '₺99.00', status: 'Ödendi' }
                                        ].map((invoice, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                                                <div>
                                                    <p className="text-gray-300">{invoice.date}</p>
                                                    <p className="text-sm text-gray-400">{invoice.amount}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-green-400 text-sm">{invoice.status}</span>
                                                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                                                        İndir
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">Şifre Değiştir</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mevcut Şifre
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full pr-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Yeni Şifre
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full pr-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Yeni Şifre (Tekrar)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full pr-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={changePassword}
                                disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                <Check className="w-4 h-4 inline mr-2" />
                                {saving ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-4 h-4 inline mr-2" />
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopSettings;

