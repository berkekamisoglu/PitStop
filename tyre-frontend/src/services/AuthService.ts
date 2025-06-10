import axiosInstance from './axiosInstance';

interface AuthResponse {
  token: string;
  userId: string;
  role: string;
  name: string;
}

interface User {
  token: string | null;
  userId: string | null;
  role: string | null;
}

const saveAuthData = (response: AuthResponse) => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('userId', response.userId);
  localStorage.setItem('userRole', response.role.toUpperCase());
  localStorage.setItem('userName', response.name);
};

const userLogin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/user/login', { email, password });
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};

const tireshopLogin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/tireshop/login', { email, password });
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};

const userRegister = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/user/register', { email, password, name });
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};

const tireshopRegister = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  address: string,
  latitude: number | null,
  longitude: number | null,
  openingHour: string,
  closingHour: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/tireshop/register', {
    email,
    password,
    name,
    phone,
    address,
    latitude,
    longitude,
    openingHour,
    closingHour
  });
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  window.location.href = '/login';
};

const getCurrentUser = () => {
  return {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    role: localStorage.getItem('userRole'),
    name: localStorage.getItem('userName')
  };
};

export default {
  userLogin,
  tireshopLogin,
  userRegister,
  tireshopRegister,
  logout,
  getCurrentUser
}; 