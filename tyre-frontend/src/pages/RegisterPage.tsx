import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { AlertCircle, Lock, Mail, Car, User, Building2, UserCircle, Phone, MapPin, Clock } from 'lucide-react';
import authService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [openingHour, setOpeningHour] = useState<string>('09:00');
  const [closingHour, setClosingHour] = useState<string>('18:00');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>('individual');
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const navigate = useNavigate();
  const defaultPosition: LatLngExpression = [41.0082, 28.9784]; // İstanbul merkez

  // Konum alma fonksiyonu
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Konum alınamadı:", error);
          setError("Konum alınamadı. Lütfen manuel olarak girin.");
        }
      );
    } else {
      setError("Tarayıcınız konum özelliğini desteklemiyor.");
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
  };

  const handleRegister = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (userType === 'company' && (!phone || !address || !selectedLocation)) {
      setError('Lütfen telefon, adres ve konum bilgilerini doldurun.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = userType === 'individual'
        ? await authService.userRegister(email, password, name)
        : await authService.tireshopRegister(
            email,
            password,
            name,
            phone,
            address,
            selectedLocation ? (selectedLocation as number[])[0] : null,
            selectedLocation ? (selectedLocation as number[])[1] : null,
            openingHour,
            closingHour
        );

      if (response && response.token) {
        const role = response.role?.toLowerCase();

        if (role === 'user') {
          navigate('/dashboard', { replace: true });
        } else if (role === 'shop') {
          navigate('/shop-dashboard', { replace: true });
        } else {
          setError('Geçersiz kullanıcı rolü.');
        }
      } else {
        setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError('');
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setError('');
  };

  const handleOpeningHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOpeningHour(e.target.value);
    setError('');
  };

  const handleClosingHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClosingHour(e.target.value);
    setError('');
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 
            className="text-5xl md:text-6xl font-black text-white tracking-wider hover:scale-105 transition-transform duration-300 cursor-default mb-2"
            style={{
              textShadow: '0 0 8px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)',
              animation: 'pulse 3s infinite'
            }}
          >
            PITSTOP
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            Türkiye'nin En Güvenilir Yol Yardım Servisi
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 py-6 px-6 shadow-2xl rounded-lg border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Hesap Oluştur
            </h2>
            <p className="text-sm text-gray-300">
              Yol yardım hizmetlerine katılın
            </p>
          </div>          {error && (
            <div className="mb-3 bg-red-900/50 p-3 rounded-md flex items-start border border-red-500">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('individual')}
                className={`flex items-center justify-center px-3 py-2 rounded-md border text-sm ${
                  userType === 'individual'
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-red-500'
                } transition-colors`}
              >
                <User className="h-4 w-4 mr-2" />
                Bireysel
              </button>
              <button
                type="button"
                onClick={() => setUserType('company')}
                className={`flex items-center justify-center px-3 py-2 rounded-md border text-sm ${
                  userType === 'company'
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-red-500'
                } transition-colors`}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Kurumsal
              </button>
            </div>            <div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder={userType === 'individual' ? 'Ad Soyad *' : 'Firma Adı *'}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder="E-posta *"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
                className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder="Şifre *"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
            </div>{userType === 'company' && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Telefon
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="+90 555 123 4567"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                    Adres
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={address}
                      onChange={handleAddressChange}
                      className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="İşletme adresi"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="openingHour" className="block text-sm font-medium text-gray-300">
                      Açılış Saati
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        id="openingHour"
                        name="openingHour"
                        type="time"
                        value={openingHour}
                        onChange={handleOpeningHourChange}
                        className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="closingHour" className="block text-sm font-medium text-gray-300">
                      Kapanış Saati
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        id="closingHour"
                        name="closingHour"
                        type="time"
                        value={closingHour}
                        onChange={handleClosingHourChange}
                        className="pl-9 block w-full pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-[300px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={selectedLocation}
                    />
                  </MapContainer>
                  <p className="text-gray-400 text-sm mt-2">
                    {selectedLocation ? 'Konum seçildi ✓' : 'Haritadan işletmenizin konumunu seçin'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Konumu Otomatik Al
                </button>
              </>
            )}            <div className="pt-2">
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-red-700 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {isLoading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-600">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Zaten hesabınız var mı?
              </p>
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 