import React, { useState, useEffect } from 'react';
import ShopSidebar from '../../components/ShopSidebar';
import { Star, User, Calendar, MessageSquare, Search, Filter, ThumbsUp, ThumbsDown, Reply, Car } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Review {
    id: number;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    vehicleInfo: string;
    serviceType: string;
    helpful: number;
    unhelpful: number;
    shopResponse?: string;
    shopResponseDate?: string;
    verified: boolean;
}

const ShopReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseText, setResponseText] = useState('');

    // Statistics
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [0, 0, 0, 0, 0]
    });

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [reviews]);    const loadReviews = async () => {
        try {
            setLoading(true);
            const shopId = localStorage.getItem('userId');
            const response = await axiosInstance.get(`/api/reviews/shop/${shopId}`);
            
            // Map backend Review data to frontend Review interface
            const mappedReviews: Review[] = response.data.map((backendReview: any) => ({
                id: backendReview.id,
                customerName: backendReview.user?.name || 'Anonymous',
                rating: backendReview.rating,
                comment: backendReview.comment || '',
                date: new Date().toISOString(), // Since backend doesn't have date field yet
                vehicleInfo: 'Vehicle Info Not Available', // Not in backend yet
                serviceType: 'Service Type Not Available', // Not in backend yet
                helpful: 0, // Not in backend yet
                unhelpful: 0, // Not in backend yet
                verified: true, // Default to true
                // shopResponse and shopResponseDate would need separate entity/fields
            }));
            
            setReviews(mappedReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Fallback to empty array instead of demo data for real integration
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        if (reviews.length === 0) return;

        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / totalReviews;

        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(review => {
            distribution[review.rating - 1]++;
        });

        setStats({
            totalReviews,
            averageRating,
            ratingDistribution: distribution
        });
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;

        return matchesSearch && matchesRating;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'oldest':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });

    const handleRespondToReview = async (reviewId: number) => {
        try {
            const response = await axiosInstance.post(`/api/reviews/${reviewId}/respond`, {
                response: responseText
            });
            
            setReviews(prev => prev.map(review => 
                review.id === reviewId 
                    ? { ...review, shopResponse: responseText, shopResponseDate: new Date().toISOString() }
                    : review
            ));
            
            setShowResponseModal(false);
            setResponseText('');
            setSelectedReview(null);
        } catch (error) {
            console.error('Error responding to review:', error);
            // For demo purposes, just update locally
            setReviews(prev => prev.map(review => 
                review.id === reviewId 
                    ? { ...review, shopResponse: responseText, shopResponseDate: new Date().toISOString() }
                    : review
            ));
            
            setShowResponseModal(false);
            setResponseText('');
            setSelectedReview(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5'
        };

        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} ${
                            star <= rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <ShopSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white text-xl">Değerlendirmeler yükleniyor...</div>
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
                        <MessageSquare className="inline-block w-8 h-8 mr-3" />
                        Müşteri Değerlendirmeleri
                    </h1>
                    <p className="text-gray-300">
                        Müşterilerinizin deneyimlerini inceleyin ve yanıtlayın
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Toplam Değerlendirme</h3>
                                <p className="text-3xl font-bold">{stats.totalReviews}</p>
                            </div>
                            <MessageSquare className="w-12 h-12 opacity-80" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Ortalama Puan</h3>
                                <div className="flex items-center">
                                    <p className="text-3xl font-bold mr-2">{stats.averageRating.toFixed(1)}</p>
                                    {renderStars(Math.round(stats.averageRating), 'sm')}
                                </div>
                            </div>
                            <Star className="w-12 h-12 opacity-80" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">5 Yıldızlı</h3>
                                <p className="text-3xl font-bold">{stats.ratingDistribution[4]}</p>
                            </div>
                            <ThumbsUp className="w-12 h-12 opacity-80" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Yanıt Oranı</h3>
                                <p className="text-3xl font-bold">
                                    {reviews.length > 0 
                                        ? Math.round((reviews.filter(r => r.shopResponse).length / reviews.length) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <Reply className="w-12 h-12 opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Puan Dağılımı</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center">
                                <span className="text-white text-sm w-8">{rating}</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                                    <div 
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ 
                                            width: `${stats.totalReviews > 0 
                                                ? (stats.ratingDistribution[rating - 1] / stats.totalReviews) * 100 
                                                : 0}%` 
                                        }}
                                    ></div>
                                </div>
                                <span className="text-gray-300 text-sm w-8">
                                    {stats.ratingDistribution[rating - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Değerlendirme ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">Tüm Puanlar</option>
                            <option value={5}>5 Yıldız</option>
                            <option value={4}>4 Yıldız</option>
                            <option value={3}>3 Yıldız</option>
                            <option value={2}>2 Yıldız</option>
                            <option value={1}>1 Yıldız</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="oldest">En Eski</option>
                            <option value="highest">En Yüksek Puan</option>
                            <option value="lowest">En Düşük Puan</option>
                        </select>

                        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrele
                        </button>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <h4 className="text-white font-semibold mr-2">{review.customerName}</h4>
                                            {review.verified && (
                                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                    Doğrulanmış
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-gray-400 text-sm ml-2">
                                                {formatDate(review.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {!review.shopResponse && (
                                    <button
                                        onClick={() => {
                                            setSelectedReview(review);
                                            setShowResponseModal(true);
                                        }}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Reply className="w-4 h-4 mr-2" />
                                        Yanıtla
                                    </button>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <Car className="w-4 h-4 mr-1" />
                                    {review.vehicleInfo} • {review.serviceType}
                                </div>
                                <p className="text-gray-300">{review.comment}</p>
                            </div>

                            {review.shopResponse && (
                                <div className="bg-gray-700 p-4 rounded-lg mt-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-white text-sm font-semibold">İ</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">İşletme Yanıtı</span>
                                            <span className="text-gray-400 text-sm ml-2">
                                                {review.shopResponseDate && formatDate(review.shopResponseDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300">{review.shopResponse}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <button className="flex items-center text-gray-400 hover:text-green-400 transition-colors">
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        Faydalı ({review.helpful})
                                    </button>
                                    <button className="flex items-center text-gray-400 hover:text-red-400 transition-colors">
                                        <ThumbsDown className="w-4 h-4 mr-1" />
                                        Faydalı değil ({review.unhelpful})
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            Değerlendirme bulunamadı
                        </h3>
                        <p className="text-gray-500">
                            Henüz hiç müşteri değerlendirmesi yok.
                        </p>
                    </div>
                )}
            </div>

            {/* Response Modal */}
            {showResponseModal && selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Değerlendirmeye Yanıt Ver
                        </h3>
                        
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <span className="text-white font-semibold">{selectedReview.customerName}</span>
                                <div className="ml-2">{renderStars(selectedReview.rating, 'sm')}</div>
                            </div>
                            <p className="text-gray-300 text-sm">{selectedReview.comment}</p>
                        </div>

                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            rows={4}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        />

                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={() => handleRespondToReview(selectedReview.id)}
                                disabled={!responseText.trim()}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                Yanıtla
                            </button>
                            <button
                                onClick={() => {
                                    setShowResponseModal(false);
                                    setResponseText('');
                                    setSelectedReview(null);
                                }}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopReviews;

