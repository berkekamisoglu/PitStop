import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

interface Review {
    id: number;
    date: string;
    rating: number;
    comment: string;
    serviceType: string;
}

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        serviceType: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axiosInstance.get('/api/reviews');
            setReviews(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/reviews', newReview);
            setNewReview({ rating: 5, comment: '', serviceType: '' });
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
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
            <h1 className="text-2xl font-bold mb-6">Değerlendirmelerim</h1>
            
            {/* Yeni Değerlendirme Formu */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Yeni Değerlendirme</h2>
                <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Puan
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Servis Tipi
                        </label>
                        <input
                            type="text"
                            value={newReview.serviceType}
                            onChange={(e) => setNewReview({ ...newReview, serviceType: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Yorum
                        </label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Değerlendirme Gönder
                    </button>
                </form>
            </div>

            {/* Değerlendirme Listesi */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`text-xl ${
                                                    index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Servis: {review.serviceType}
                                    </p>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;

