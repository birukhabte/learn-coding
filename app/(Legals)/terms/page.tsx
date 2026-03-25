// pages/terms.tsx
import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">1. Acceptance of Terms</h3>
            <p className="mb-4">
              By accessing and using CodeLearn, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">2. Use License</h3>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on CodeLearn for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to decompile or reverse engineer any software contained on CodeLearn</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
              <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">3. Disclaimer</h3>
            <p className="mb-4">
              The materials on CodeLearn are provided on an 'as is' basis. CodeLearn makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">4. Limitations</h3>
            <p className="mb-4">
              In no event shall CodeLearn or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CodeLearn, even if CodeLearn or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">5. Accuracy of Materials</h3>
            <p className="mb-4">
              The materials appearing on CodeLearn could include technical, typographical, or photographic errors. CodeLearn does not warrant that any of the materials on its website are accurate, complete, or current. CodeLearn may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">6. Links</h3>
            <p className="mb-4">
              CodeLearn has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CodeLearn of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">7. Modifications</h3>
            <p className="mb-4">
              CodeLearn may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">8. Governing Law</h3>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which CodeLearn operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">9. Contact Information</h3>
            <p>
              If you have any questions about these Terms of Service, please contact us at <a href="mailto:pykinsu@outlook.com" className="underline hover:opacity-70">pykinsu@outlook.com</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-black mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center text-xs sm:text-sm">
            <p>© 2025 CodeLearn. Crafted with ❤️ by <a href="https://github.com/pykinsu" className="underline hover:opacity-70">@pykinsu</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
