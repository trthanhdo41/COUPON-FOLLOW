import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Use</h1>
          
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> October 16, 2024
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using CouponFollow.com ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily download one copy of the materials on CouponFollow.com for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on CouponFollow.com are provided on an 'as is' basis. CouponFollow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall CouponFollow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CouponFollow.com, even if CouponFollow or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Accuracy of Materials</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on CouponFollow.com could include technical, typographical, or photographic errors. CouponFollow does not warrant that any of the materials on its website are accurate, complete, or current. CouponFollow may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Links</h2>
          <p className="text-gray-700 mb-4">
            CouponFollow has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CouponFollow of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Modifications</h2>
          <p className="text-gray-700 mb-4">
            CouponFollow may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              If you have any questions about these Terms of Use, please contact us at{' '}
              <a href="mailto:legal@couponfollow.com" className="text-primary hover:underline">
                legal@couponfollow.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
