import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editForm, setEditForm] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/users/profile');
            setProfile(response.data);
            setEditForm(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm) return;

        try {
            await axiosInstance.put('/api/users/profile', editForm);
            setProfile(editForm);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Profil Bilgilerim</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    {!isEditing ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Ad</h3>
                                    <p className="mt-1 text-lg">{profile?.firstName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Soyad</h3>
                                    <p className="mt-1 text-lg">{profile?.lastName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                                    <p className="mt-1 text-lg">{profile?.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
                                    <p className="mt-1 text-lg">{profile?.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Adres</h3>
                                    <p className="mt-1 text-lg">{profile?.address}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Profili Düzenle
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ad
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm?.firstName}
                                        onChange={(e) => setEditForm(prev => ({...prev!, firstName: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Soyad
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm?.lastName}
                                        onChange={(e) => setEditForm(prev => ({...prev!, lastName: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm?.email}
                                        onChange={(e) => setEditForm(prev => ({...prev!, email: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={editForm?.phone}
                                        onChange={(e) => setEditForm(prev => ({...prev!, phone: e.target.value}))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Adres
                                    </label>
                                    <textarea
                                        value={editForm?.address}
                                        onChange={(e) => setEditForm(prev => ({...prev!, address: e.target.value}))}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Kaydet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm(profile);
                                    }}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

