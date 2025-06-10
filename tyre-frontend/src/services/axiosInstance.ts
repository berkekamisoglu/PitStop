import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token ile ilgili hatalar (401 veya 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = window.location.pathname;
      
      // Eğer zaten login sayfasında değilsek
      if (!['/login', '/register'].includes(currentPath)) {
        try {
          // Token'ı kontrol et
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const isExpired = payload.exp * 1000 < Date.now();
              
              if (isExpired) {
                console.log('Token expired, redirecting to login');
              } else {
                // Token geçerli ama yetki hatası
                console.log('Authorization error, but token is valid');
                return Promise.reject(error);
              }
            } catch (e) {
              console.log('Token parse error');
            }
          }
          
          // Token yok veya geçersiz, temizle ve yönlendir
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          
          // Mevcut sayfayı redirect parametresi olarak ekle
          const redirectPath = `/login?redirect=${encodeURIComponent(currentPath)}`;
          
          // Eğer zaten aynı sayfaya yönlendirilmiyorsak
          if (window.location.href !== redirectPath) {
            window.location.href = redirectPath;
          }
        } catch (e) {
          console.error('Error in auth error handling:', e);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;