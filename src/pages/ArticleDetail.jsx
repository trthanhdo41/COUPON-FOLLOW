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
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                Share on Facebook
              </button>
              <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors">
                Share on Twitter
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
