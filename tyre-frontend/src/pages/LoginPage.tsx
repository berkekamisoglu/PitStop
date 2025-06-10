import React, { FormEvent, useState } from 'react';
import { AlertCircle, Lock, Mail, User, Building2, Phone, MapPin, Clock } from 'lucide-react';
import authService from '../services/AuthService';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/flip-card.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

type UserType = 'individual' | 'company';

// Özel servis noktası ikonu
const shopIcon = L.divIcon({
    className: 'custom-shop-icon',
    html: `<div style="
        background-color: #EF4444;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
        </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Harita için marker seçim komponenti
const LocationPicker: React.FC<{
    onLocationSelect: (lat: number, lng: number) => void;
    selectedLocation: LatLngExpression | null;
}> = ({ onLocationSelect, selectedLocation }) => {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationSelect(lat, lng);
        },
    });

    return selectedLocation ? (
        <Marker position={selectedLocation} icon={shopIcon}>
            <Popup>Seçilen Konum</Popup>
        </Marker>
    ) : null;
};

const LoginPage: React.FC = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Register state
  const [isFlipped, setIsFlipped] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUserType, setRegisterUserType] = useState<UserType>('individual');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingHour, setOpeningHour] = useState('09:00');
  const [closingHour, setClosingHour] = useState('18:00');
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const defaultPosition: LatLngExpression = [41.0082, 28.9784]; // İstanbul merkez

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    // Reset errors when switching
    setError('');
    setRegisterError('');
  };

  // Konum alma fonksiyonu
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setSelectedLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Konum alınamadı:", error);
          setRegisterError("Konum alınamadı. Lütfen manuel olarak girin.");
        }
      );
    } else {
      setRegisterError("Tarayıcınız konum özelliğini desteklemiyor.");
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with userType:', userType);
      
      const response = userType === 'individual' 
        ? await authService.userLogin(email, password)
        : await authService.tireshopLogin(email, password);

      console.log('Full response:', response);

      if (response && response.token) {
        console.log('Login successful!');
        console.log('Response token:', response.token);
        console.log('Response role:', response.role);

        const role = response.role?.toLowerCase();
        console.log('Processed role:', role);

        if (role === 'user') {
          console.log('Redirecting to customer dashboard');
          navigate('/dashboard', { replace: true });
        } else if (role === 'shop') {
          console.log('Redirecting to shop dashboard');
          navigate('/shop-dashboard', { replace: true });
        } else {
          console.log('Unknown role:', role);
          setError('Geçersiz kullanıcı rolü.');
        }
      } else {
        console.log('Login failed - no token in response');
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'E-posta veya şifre hatalı.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!registerEmail || !registerPassword || !name) {
      setRegisterError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (registerUserType === 'company' && (!phone || !address || !selectedLocation)) {
      setRegisterError('Kurumsal hesap için tüm alanları doldurun ve haritadan konum seçin.');
      return;
    }

    setIsRegisterLoading(true);
    setRegisterError('');

    try {
      if (registerUserType === 'individual') {
        await authService.userRegister(registerEmail, registerPassword, name);
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        setIsFlipped(false); // Giriş formuna geç
      } else {
        await authService.tireshopRegister(
          registerEmail,
          registerPassword,
          name,
          phone,
          address,
          latitude,
          longitude,
          openingHour,
          closingHour
        );
        alert('Servis kaydı başarılı! Giriş yapabilirsiniz.');
        setIsFlipped(false); // Giriş formuna geç
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setRegisterError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Main title */}
        <div className="text-center mb-8">
          <h1 
            className="text-5xl md:text-6xl font-black text-white tracking-wider hover:scale-105 transition-transform duration-300 cursor-default mb-2"
            style={{
              textShadow: '0 0 8px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)',
              animation: 'pulse 3s infinite'
            }}
          >
            PITSTOP
          </h1>
          <p className="text-lg text-gray-300 font-medium mb-6">
            Türkiye'nin En Güvenilir Yol Yardım Servisi
          </p>
        </div>
        
        {/* Flip Card Container */}
        <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            {/* Front Side - Login Form */}
            <div className="flip-card-front">
              <div className="bg-gray-800 py-8 px-8 shadow-2xl rounded-lg border border-gray-700 h-full min-h-[650px] flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Hoş Geldiniz
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Yol yardım hizmetleri için giriş yapın
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-6 bg-red-900/50 p-4 rounded-md flex items-start border border-red-500">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-400">{error}</span>
                    </div>
                  )}

                  <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleSubmit}>
                    <div className="flex-1 space-y-6">
                      {/* User Type Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setUserType('individual')}
                          className={`flex items-center justify-center px-4 py-3 rounded-md border text-sm font-medium transition-all duration-200 ${
                            userType === 'individual'
                              ? 'bg-red-600 border-red-500 text-white shadow-lg'
                              : 'border-gray-600 text-gray-300 hover:border-red-500 hover:bg-gray-700'
                          }`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Bireysel
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserType('company')}
                          className={`flex items-center justify-center px-4 py-3 rounded-md border text-sm font-medium transition-all duration-200 ${
                            userType === 'company'
                              ? 'bg-red-600 border-red-500 text-white shadow-lg'
                              : 'border-gray-600 text-gray-300 hover:border-red-500 hover:bg-gray-700'
                          }`}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Kurumsal
                        </button>
                      </div>

                      {/* Email Input */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          E-posta
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                            placeholder="ornek@email.com"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                          Şifre
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                            placeholder="••••••••"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                          isLoading
                            ? 'bg-red-700 cursor-not-allowed opacity-75'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:shadow-lg'
                        }`}
                      >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-3">
                      Hesabınız yok mu?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      Yeni Hesap Oluştur
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side - Register Form */}
            <div className="flip-card-back">
              <div className="bg-gray-800 py-6 px-6 shadow-2xl rounded-lg border border-gray-700 h-full min-h-[650px] flex flex-col">
                <div className="flex-none">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Hesap Oluştur
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Yol yardım hizmetlerine katılın
                    </p>
                  </div>
                  
                  {registerError && (
                    <div className="mb-4 bg-red-900/50 p-3 rounded-md flex items-start border border-red-500">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-sm text-red-400">{registerError}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <form className="space-y-4 pb-2" onSubmit={handleRegister}>
                    <div className="space-y-4">
                      {/* User Type Selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRegisterUserType('individual')}
                          className={`flex items-center justify-center px-3 py-2.5 rounded-md border text-sm font-medium transition-all duration-200 ${
                            registerUserType === 'individual'
                              ? 'bg-red-600 border-red-500 text-white shadow-lg'
                              : 'border-gray-600 text-gray-300 hover:border-red-500 hover:bg-gray-700'
                          }`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Bireysel
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegisterUserType('company')}
                          className={`flex items-center justify-center px-3 py-2.5 rounded-md border text-sm font-medium transition-all duration-200 ${
                            registerUserType === 'company'
                              ? 'bg-red-600 border-red-500 text-white shadow-lg'
                              : 'border-gray-600 text-gray-300 hover:border-red-500 hover:bg-gray-700'
                          }`}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Kurumsal
                        </button>
                      </div>

                      {/* Name Input */}
                      <div>
                        <label htmlFor="register-name" className="block text-sm font-medium text-gray-300 mb-1">
                          {registerUserType === 'individual' ? 'Ad Soyad' : 'Servis Adı'} *
                        </label>
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="appearance-none block w-full px-3 py-2.5 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                          placeholder={registerUserType === 'individual' ? 'Adınız Soyadınız' : 'Servis Adı'}
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1">
                          E-posta *
                        </label>
                        <div className="relative">
                          <input
                            id="register-email"
                            type="email"
                            required
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                            placeholder="ornek@email.com"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1">
                          Şifre *
                        </label>
                        <div className="relative">
                          <input
                            id="register-password"
                            type="password"
                            required
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                            placeholder="••••••••"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Company specific fields */}
                      {registerUserType === 'company' && (
                        <>
                          {/* Phone Input */}
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                              Telefon *
                            </label>
                            <div className="relative">
                              <input
                                id="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                                placeholder="0532 123 45 67"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Address Input */}
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                              Adres *
                            </label>
                            <div className="relative">
                              <textarea
                                id="address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={2}
                                className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none transition-all duration-200"
                                placeholder="Servis adresinizi girin"
                              />
                              <div className="absolute top-2.5 right-0 flex items-center pr-3">
                                <MapPin className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Working Hours */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="opening-hour" className="block text-sm font-medium text-gray-300 mb-1">
                                Açılış Saati
                              </label>
                              <div className="relative">
                                <input
                                  id="opening-hour"
                                  type="time"
                                  value={openingHour}
                                  onChange={(e) => setOpeningHour(e.target.value)}
                                  className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="closing-hour" className="block text-sm font-medium text-gray-300 mb-1">
                                Kapanış Saati
                              </label>
                              <div className="relative">
                                <input
                                  id="closing-hour"
                                  type="time"
                                  value={closingHour}
                                  onChange={(e) => setClosingHour(e.target.value)}
                                  className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Konum Seçimi * 
                              <button
                                type="button"
                                onClick={getLocation}
                                className="ml-2 text-red-400 hover:text-red-300 text-xs underline transition-colors duration-200"
                              >
                                Mevcut konumumu kullan
                              </button>
                            </label>
                            <div className="h-32 rounded-md overflow-hidden border border-gray-600">
                              <MapContainer
                                center={selectedLocation || defaultPosition}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationPicker
                                  onLocationSelect={handleLocationSelect}
                                  selectedLocation={selectedLocation}
                                />
                              </MapContainer>
                            </div>
                            {selectedLocation && Array.isArray(selectedLocation) && (
                              <p className="text-xs text-gray-400 mt-1">
                                Seçilen konum: {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isRegisterLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                          isRegisterLoading
                            ? 'bg-red-700 cursor-not-allowed opacity-75'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:shadow-lg'
                        }`}
                      >
                        {isRegisterLoading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="flex-none mt-4 pt-4 border-t border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-3">
                      Zaten hesabınız var mı?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="w-full flex justify-center py-2.5 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      Giriş Yap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
