import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { FiStar, FiThumbsUp, FiThumbsDown, FiUser, FiCalendar } from 'react-icons/fi';

const ReviewsSystem = ({ storeId, storeName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [storeId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('storeId', '==', storeId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(reviewsQuery);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        storeId,
        storeName,
        createdAt: new Date(),
        helpful: 0,
        notHelpful: 0
      });
      
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        name: '',
        email: ''
      });
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    try {
      // In a real app, you'd update the review document
      // For now, we'll just update the local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              helpful: isHelpful ? review.helpful + 1 : review.helpful,
              notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
            }
          : review
      ));
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <FiStar
                key={star}
                className={`w-6 h-6 ${
                  star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">Based on {reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-8">{star}</span>
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none"
                  >
                    <FiStar
                      className={`w-8 h-8 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Title *</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                required
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                required
                rows={4}
                placeholder="Tell others about your experience with this store..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        <FiCalendar className="w-4 h-4 inline mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => handleHelpful(review.id, true)}
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <FiThumbsUp className="w-4 h-4" />
                  Yes ({review.helpful})
                </button>
                <button
                  onClick={() => handleHelpful(review.id, false)}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <FiThumbsDown className="w-4 h-4" />
                  No ({review.notHelpful})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⭐</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h4>
            <p className="text-gray-500">Be the first to review this store!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSystem;
