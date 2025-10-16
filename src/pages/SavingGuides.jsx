import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SavingGuides() {
  const [visibleArticles, setVisibleArticles] = useState(6);

  const articles = [
    {
      title: 'Financial Resources and Support For the 2024-25 School Year',
      category: 'CouponFollow',
      date: '3 mos ago',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop',
      color: 'from-blue-400 to-purple-500'
    },
    {
      title: 'A Guide to Saving Money on Your Next Wedding',
      category: 'CouponFollow',
      date: '3 mos ago',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      color: 'from-pink-400 to-rose-500'
    },
    {
      title: 'One Sales Calendar: Best Times of Year to Shop on Amazon',
      category: 'Dell',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Tory Burch Sale Calendar: Best Time of Year to Shop for Designer Bags',
      category: 'Tory Burch',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop',
      color: 'from-orange-400 to-red-500'
    },
    {
      title: 'Living Without a Salary Has Become the New U.S. 2025',
      category: 'Money',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Sales of Savings in 2025',
      category: 'Money',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=400&h=300&fit=crop',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Making Financially Smart Decisions',
      category: 'Tips',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      title: 'Halloween 2025 Budgeting and Shopping Guide',
      category: 'Celebrate',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=300&fit=crop',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'State Teacher\'s Supply Discount Programs',
      category: 'School',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      title: 'Easy Resources For Budget Friendly Family Fun',
      category: 'Kids',
      date: '5 mos ago',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      color: 'from-pink-400 to-purple-500'
    }
  ];

  const handleLoadMore = () => {
    setVisibleArticles(prev => Math.min(prev + 6, articles.length));
  };

  const handleArticleClick = (article) => {
    // Store article data in localStorage for detail page
    localStorage.setItem('currentArticle', JSON.stringify(article));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-4">Most Recent Research & Articles</h1>
          <p className="text-gray-600 text-lg max-w-4xl">
            Welcome to CouponFollow's money blog! If you're looking for help with your finances, then you've come to the right place. Our blog is packed with useful articles and resources to help you save money, make smarter purchasing decisions, and learn how to make the most of your hard-earned cash. From tips on how to save money on everyday purchases to advice on how to invest wisely, we've got you covered.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.slice(0, visibleArticles).map((article, index) => (
              <Link
                key={index}
                to={`/article/${index + 1}`}
                onClick={() => handleArticleClick(article)}
                className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Real Image */}
                <div className={`h-48 bg-gradient-to-br ${article.color} overflow-hidden`}>
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-6xl">📝</div>';
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#2c3e50] mb-3 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {article.category}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                      </svg>
                      {article.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {visibleArticles < articles.length && (
            <div className="text-center mt-12">
              <button 
                onClick={handleLoadMore}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 transition-colors"
              >
                Load More Articles ({articles.length - visibleArticles} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

