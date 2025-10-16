import React from 'react';
import { FiUsers, FiTarget, FiAward, FiTrendingUp, FiShield, FiHeart } from 'react-icons/fi';

const AboutUs = () => {
  const stats = [
    { number: '1M+', label: 'Active Users', icon: FiUsers },
    { number: '10K+', label: 'Verified Coupons', icon: FiAward },
    { number: '500+', label: 'Partner Stores', icon: FiTarget },
    { number: '$50M+', label: 'Money Saved', icon: FiTrendingUp }
  ];

  const values = [
    {
      icon: FiShield,
      title: 'Trust & Security',
      description: 'We verify every coupon and ensure our users get the best deals safely and securely.'
    },
    {
      icon: FiHeart,
      title: 'User-First Approach',
      description: 'Our platform is designed with our users in mind, making saving money simple and enjoyable.'
    },
    {
      icon: FiAward,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards for coupon verification and store partnerships.'
    },
    {
      icon: FiTrendingUp,
      title: 'Continuous Innovation',
      description: 'We constantly improve our platform to provide better deals and user experience.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      description: 'Passionate about helping people save money and find the best deals.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Tech enthusiast focused on building innovative solutions for our users.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Expert in building relationships with top retailers and brands.'
    },
    {
      name: 'David Kim',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Creative marketer dedicated to spreading the word about great deals.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About CouponFollow</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help millions of people save money every day by providing 
              access to the best coupons, deals, and cashback offers from thousands of trusted retailers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  CouponFollow was founded in 2020 with a simple yet powerful vision: to make saving money 
                  accessible to everyone. What started as a small team's passion project has grown into 
                  one of the most trusted coupon platforms on the web.
                </p>
                <p>
                  We understand that every dollar saved matters, whether you're a student on a tight budget, 
                  a family looking to stretch your income, or anyone who simply loves a good deal. That's 
                  why we've built a platform that makes finding and using coupons effortless.
                </p>
                <p>
                  Today, we're proud to serve over a million users who have collectively saved more than 
                  $50 million through our platform. But we're just getting started – our goal is to help 
                  even more people discover the joy of saving money.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiHeart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 text-lg">
                  "To democratize savings by making the best deals accessible to everyone, 
                  everywhere, every day."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind CouponFollow who work tirelessly to bring you the best deals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold" style={{display: 'none'}}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CouponFollow?</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We're not just another coupon site – we're your trusted partner in saving money.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Verified</h3>
              <p className="opacity-90">
                Every coupon is manually verified by our team to ensure it works when you need it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Always Updated</h3>
              <p className="opacity-90">
                Our database is updated daily with fresh deals and expired coupons are removed promptly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="opacity-90">
                Our community of users helps us discover and share the best deals from around the web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Saving?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join millions of users who are already saving money with CouponFollow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Coupons
            </a>
            <a
              href="/stores"
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Explore Stores
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
