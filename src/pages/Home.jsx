import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FiTag, FiPercent, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const [topCoupons, setTopCoupons] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch top coupons
      const couponsQuery = query(
        collection(db, 'coupons'), 
        orderBy('createdAt', 'desc'), 
        limit(8)
      );
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopCoupons(couponsData);

      // Fetch top stores
      const storesQuery = query(
        collection(db, 'stores'), 
        orderBy('createdAt', 'desc'), 
        limit(6)
      );
      const storesSnapshot = await getDocs(storesQuery);
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopStores(storesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Today's Top Coupons - Swiper Carousel */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2c3e50] mb-10 text-center">Today's Top Coupons</h1>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : topCoupons.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm">
              <FiTag className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-xl mb-2">No coupons available yet</p>
              <p className="text-gray-400">Check back soon for amazing deals!</p>
            </div>
          ) : (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
                pagination={{ 
                  clickable: true,
                  el: '.swiper-pagination-custom'
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                loop={true}
                className="top-coupons-swiper"
              >
                {topCoupons.slice(0, 12).map((coupon) => (
                  <SwiperSlide key={coupon.id}>
                    <Link
                      to={`/store/${coupon.storeId}`}
                      className="block bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-200 relative"
                      style={{ height: '380px' }}
                    >
                      {/* Exclusive Badge */}
                      {coupon.exclusive && (
                        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1.5 flex items-center gap-2 z-10 shadow-md">
                          <span className="text-base">⭐</span>
                          <span>EXCLUSIVE</span>
                        </div>
                      )}

                      {/* Logo Area - Bigger */}
                      <div className="h-[280px] flex items-center justify-center p-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
                        {coupon.storeLogoUrl ? (
                          <img 
                            src={coupon.storeLogoUrl} 
                            alt={coupon.storeName}
                            className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="text-8xl font-bold text-gray-300">
                            {coupon.storeName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      {/* Info Area - Cleaner */}
                      <div className="p-6 text-center bg-white border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2 font-semibold tracking-wide uppercase">
                          {coupon.storeName}
                        </p>
                        <p className="font-bold text-xl text-[#2c3e50] group-hover:text-primary transition-colors">
                          {coupon.discount}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows - Larger & Better positioned */}
              <button className="swiper-button-prev-custom absolute left-0 top-[45%] -translate-y-1/2 z-10 bg-white shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 -ml-7 border border-gray-200 hover:border-primary">
                <FiChevronLeft size={28} strokeWidth={2.5} />
              </button>
              <button className="swiper-button-next-custom absolute right-0 top-[45%] -translate-y-1/2 z-10 bg-white shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 -mr-7 border border-gray-200 hover:border-primary">
                <FiChevronRight size={28} strokeWidth={2.5} />
              </button>

              {/* Custom Pagination - Dots */}
              <div className="swiper-pagination-custom mt-8 flex justify-center gap-2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Stores Grid */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : topStores.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                {topStores.slice(0, 6).map((store) => (
                  <Link 
                    key={store.id} 
                    to={`/store/${store.id}`}
                    className="flex flex-col items-center bg-white hover:bg-gray-50 p-6 transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-primary group"
                  >
                    <div className="w-24 h-24 flex items-center justify-center mb-3 p-2">
                      {store.logoUrl ? (
                        <img 
                          src={store.logoUrl} 
                          alt={store.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400">
                            {store.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-[#2c3e50] text-center text-sm mb-3 group-hover:text-primary transition-colors">
                      {store.name}
                    </p>
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-4 py-2 transition-all w-full">
                      Save 50% Off
                    </button>
                  </Link>
                ))}
              </div>

              {/* Trending Searches */}
              <div className="border-2 border-dashed border-gray-300 p-6 mt-6 bg-white">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="font-bold text-[#2c3e50] text-base">Trending searches:</span>
                  <Link to="/search?q=big5" className="text-[#0891b2] hover:underline text-sm">
                    Big 5 coupon codes
                  </Link>
                  <Link to="/search?q=cvs" className="text-[#0891b2] hover:underline text-sm">
                    CVS Photo coupons
                  </Link>
                  <Link to="/search?q=blinds" className="text-[#0891b2] hover:underline text-sm">
                    Select Blinds coupon codes
                  </Link>
                  <Link to="/search?q=vici" className="text-[#0891b2] hover:underline text-sm">
                    VICI coupons
                  </Link>
                  <Link to="/search?q=victoria" className="text-[#0891b2] hover:underline text-sm">
                    Victoria's Secret coupons
                  </Link>
                  <Link to="/search?q=homedepot" className="text-[#0891b2] hover:underline text-sm">
                    Home Depot coupon codes
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Featured Deal Section - Brown Background */}
      <div className="bg-[#704214] py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Left Side - Deal Info Card */}
            <div className="bg-white p-12 relative z-10 featured-deal-card">
              {/* eBay Logo */}
              <div className="mb-6">
                <img 
                  src="/logo_100_ebay.webp" 
                  alt="eBay" 
                  className="h-12 w-auto"
                />
              </div>

              <h2 className="text-4xl font-bold text-[#2c3e50] mb-4 leading-tight">
                eBay Coupon Code: Get 25% Off Your Order
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Use this eBay promo code for 25% off party goods, including decor, cleaning equipment, and more, and become the ultimate host.
              </p>
              <button className="bg-[#3665F3] hover:bg-[#2851d6] text-white font-bold text-lg px-12 py-4 transition-all shadow-lg hover:shadow-xl">
                Get this Deal
              </button>
            </div>

            {/* Right Side - Decorative Area with Image */}
            <div className="relative min-h-[400px] hidden lg:flex items-center justify-center p-12">
              {/* Decorative circles */}
              <div className="absolute top-8 left-8 w-32 h-32 bg-[#F5E6D3] rounded-full flex items-center justify-center shadow-xl">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path d="M20 40L35 55L60 30" stroke="#704214" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="absolute bottom-8 left-8 w-44 h-44 bg-[#FF8C00] rounded-2xl shadow-xl"></div>
              <div className="absolute top-8 right-8 w-44 h-44 bg-[#FF8C00] rounded-2xl shadow-xl"></div>

              <div className="absolute bottom-8 right-8 w-32 h-32 bg-[#F5E6D3] rounded-full flex items-center justify-center shadow-xl">
                <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                  <circle cx="28" cy="25" r="4" fill="#704214"/>
                  <circle cx="42" cy="25" r="4" fill="#704214"/>
                  <path d="M22 40C22 40 28 48 35 48C42 48 48 40 48 40" stroke="#704214" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Center image */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-72 bg-white rounded-lg shadow-2xl overflow-hidden z-10 p-4">
                <img 
                  src="/istockphoto-1164904657-612x612.jpg" 
                  alt="Featured deal"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Trending Coupons - CouponFollow Style */}
      <div className="bg-gray-50 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8 relative">
            <h2 className="text-4xl font-bold text-[#2c3e50] text-center">Today's Trending Coupons</h2>
            {/* Dog Peeking - Right of Title */}
            <div className="absolute right-0 -top-2 w-20 h-20 z-30">
              <img src="/cently-peeking.svg" alt="Cently mascot" className="w-full h-full" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : topCoupons.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
              <FiTag className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-xl mb-2">No coupons available yet</p>
              <p className="text-gray-400">Check back soon for amazing deals!</p>
            </div>
          ) : (
            <div>
              {topCoupons.slice(6).map((coupon) => (
                <article key={coupon.id} className="trending-offer">
                  {/* Logo */}
                  <div className="short-info">
                    {coupon.storeLogoUrl ? (
                      <img 
                        src={coupon.storeLogoUrl} 
                        alt={coupon.storeName}
                        className="logo"
                      />
                    ) : (
                      <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-400">
                          {coupon.storeName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="tile">
                    <span className="big">{coupon.discount?.split(' ')[0] || 'SAVE'}</span>
                    <span className="small">
                      {coupon.code ? 'WITH CODE' : coupon.discount?.split(' ').slice(1).join(' ') || 'OFF'}
                    </span>
                    <span className="deal-type">{coupon.code ? 'CODE' : 'PROMO'}</span>
                  </div>

                  {/* Content + Button */}
                  <div className="deal-content">
                    <div className="info">
                      <h3 className="title">{coupon.title}</h3>
                      <p className="description">{coupon.description}</p>
                    </div>

                    {/* Right: Button + Link */}
                    <div className="right">
                      {coupon.code ? (
                        <div className="btn-reveal">
                          <span className="code">{coupon.code}</span>
                          <div className="cover">COUPON CODE</div>
                        </div>
                      ) : (
                        <a
                          href={coupon.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 transition-all w-[180px] h-[52px] flex items-center justify-center text-sm uppercase"
                        >
                          Get this deal
                        </a>
                      )}
                      <p className="merchant">
                        <Link to={`/store/${coupon.storeId}`} className="merchant-name">
                          {coupon.storeName} Coupons
                        </Link>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Stores */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-10 text-center">Popular Stores</h2>
          
          <div className="border-2 border-dashed border-gray-300 p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
              {['adidas', 'AliExpress', 'Amazon', 'American Eagle', 'Arhaus', 'Autodesk', 'B&H Photo Video Pro Audio', 'Barnes & Noble', 'Belk', 'Bloomingdale\'s', 'Brownells', 'Cettire', 'Chewy', 'Children\'s Place', 'COACH', 'Coach Outlet', 'Dell', 'DSW', 'eBay', 'Edible Arrangements', 'Eight Sleep', 'Evereve', 'Expedia', 'Express', 'Forever 21', 'GoDaddy', 'Groupon', 'HelloFresh', 'Hobby Lobby', 'HostGator', 'iHerb', 'JCPenney', 'Kohl\'s', 'Macy\'s', 'Maurices', 'Michaels', 'Newegg', 'Nike', 'Nordstrom Rack', 'NordVPN', 'NutriSystem', 'Old Navy', 'Orbitz', 'PacSun', 'PLT', 'Priceline', 'Princess Polly', 'Redbubble', 'SHEIN', 'Staples', 'Target', 'The Ordinary', 'TikTok Shop', 'Uber Eats', 'Udemy', 'Urban Outfitters', 'Victoria\'s Secret', 'Walmart', 'Wayfair', 'Zoro'].map((store, index) => (
                <Link 
                  key={index} 
                  to={`/search?q=${store.toLowerCase()}`}
                  className="text-[#64748b] hover:text-[#0891b2] hover:underline text-sm transition-colors"
                >
                  {store}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="bg-white p-6 border border-gray-200 group">
              <summary className="flex items-center justify-between cursor-pointer text-xl font-bold text-[#2c3e50]">
                What is a promo code?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed">
                A promo code is an alphanumeric phrase used during checkout to receive an online digital discount (or other benefit) on the purchase of e-commerce goods or services. It is used interchangeably with terms like coupon code, discount code, voucher code and sometimes is simply referred to as an online digital coupon. You can find promo codes for over 5,000 brands and learn more about couponing to maximize your savings by utilizing the educational resources on CouponFollow website.
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="bg-white p-6 border border-gray-200 group">
              <summary className="flex items-center justify-between cursor-pointer text-xl font-bold text-[#2c3e50]">
                How can I get a discount or promo code every time I shop?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed">
                Remembering to search for a coupon isn't always easy and can be time consuming. We suggest you bookmark CouponFollow.com, or if you're using a desktop device with Chrome or Edge you can install the Cently coupon browser extension which automatically applies promo codes whenever you checkout. On average, Cently users save about $20 bucks on their purchase whenever a discount is found.
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="bg-white p-6 border border-gray-200 group">
              <summary className="flex items-center justify-between cursor-pointer text-xl font-bold text-[#2c3e50]">
                Do promo codes work?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed">
                Yes, but many only last for a very short period of time. Often retailers run promo code campaigns to incentivize shoppers and many use <Link to="/articles/common-coupon-phrases" className="text-[#0891b2] underline">common coupon phrases</Link> throughout the year. In fact, data from our automatic coupon browser extension, Cently, finds that between 40% to 45% of the time a user receives a discount. This correlates with between every 2 to 3 shopping journeys a consumer has.
              </div>
            </details>
          </div>

          {/* Popular Articles */}
          <div className="border-2 border-dashed border-gray-300 p-6 mt-12 bg-white">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="font-bold text-[#2c3e50] text-base">Popular articles:</span>
              <Link to="/articles/ebay-statistics" className="text-[#0891b2] hover:underline text-sm">
                eBay Statistics: Market Share, Growth, Users, and More
              </Link>
              <Link to="/articles/double-cashback-day" className="text-[#0891b2] hover:underline text-sm">
                Double Cashback Day
              </Link>
              <Link to="/articles/michael-kors-savings" className="text-[#0891b2] hover:underline text-sm">
                Michael Kors Savings Tips
              </Link>
              <Link to="/articles/restaurants-free-delivery" className="text-[#0891b2] hover:underline text-sm">
                Restaurants With Free Delivery
              </Link>
              <Link to="/articles/budget-valentines" className="text-[#0891b2] hover:underline text-sm">
                Budget Friendly Valentine's Day Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

