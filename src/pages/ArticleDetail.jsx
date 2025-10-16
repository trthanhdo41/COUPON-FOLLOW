import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Get article from localStorage or create default
    const savedArticle = localStorage.getItem('currentArticle');
    if (savedArticle) {
      setArticle(JSON.parse(savedArticle));
    } else {
      // Fallback article data
      setArticle({
        title: 'Financial Resources and Support For the 2024-25 School Year',
        category: 'CouponFollow',
        date: '3 mos ago',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop',
        color: 'from-blue-400 to-purple-500',
        content: `
          <h2>Introduction</h2>
          <p>As we approach the 2024-25 school year, students and families are facing unprecedented financial challenges. This comprehensive guide provides essential resources and support systems to help navigate these difficult times.</p>
          
          <h2>Federal Financial Aid Programs</h2>
          <p>The federal government offers several programs to help students afford higher education:</p>
          <ul>
            <li><strong>Pell Grants:</strong> Need-based grants that don't require repayment</li>
            <li><strong>Federal Student Loans:</strong> Low-interest loans with flexible repayment options</li>
            <li><strong>Work-Study Programs:</strong> Part-time employment opportunities on campus</li>
          </ul>
          
          <h2>State-Level Support</h2>
          <p>Many states offer additional financial assistance programs:</p>
          <ul>
            <li>State grants and scholarships</li>
            <li>Tuition assistance programs</li>
            <li>Community college partnerships</li>
          </ul>
          
          <h2>Private Scholarships and Grants</h2>
          <p>Thousands of private organizations offer scholarships based on various criteria:</p>
          <ul>
            <li>Academic merit</li>
            <li>Financial need</li>
            <li>Field of study</li>
            <li>Demographic background</li>
          </ul>
          
          <h2>Budgeting Tips for Students</h2>
          <p>Creating and sticking to a budget is crucial for financial success:</p>
          <ol>
            <li>Track all income and expenses</li>
            <li>Prioritize essential costs (tuition, housing, food)</li>
            <li>Look for student discounts</li>
            <li>Consider part-time work or internships</li>
          </ol>
          
          <h2>Conclusion</h2>
          <p>With proper planning and utilization of available resources, students can successfully navigate the financial challenges of higher education. Remember to apply early, meet all deadlines, and don't hesitate to seek help from financial aid offices.</p>
        `
      });
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link to="/saving-guides" className="text-primary hover:underline">
              ← Back to Saving Guides
            </Link>
          </nav>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
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
          
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-6 leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Article Image */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`h-96 bg-gradient-to-br ${article.color} overflow-hidden rounded-lg`}>
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-8xl">📝</div>';
              }}
            />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Share this article:</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const title = encodeURIComponent(article.title);
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
              </button>
              <button 
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const title = encodeURIComponent(article.title);
                  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share on Twitter
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
              <button 
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const title = encodeURIComponent(article.title);
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
