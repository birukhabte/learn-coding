// pages/privacy.tsx
import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">1. Introduction</h3>
            <p className="mb-4">
              CodeLearn ("we", "us", "our", or "Company") operates the CodeLearn website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">2. Information Collection and Use</h3>
            <p className="mb-4">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h4 className="font-bold mb-2">Personal Data:</h4>
                <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>• Email address</li>
                  <li>• First name and last name</li>
                  <li>• Cookies and Usage Data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-2">Usage Data:</h4>
                <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages you visit, the time and date of your visit, and other diagnostic data.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">3. Use of Data</h3>
            <p className="mb-4">CodeLearn uses the collected data for various purposes:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>• To provide and maintain our Service</li>
              <li>• To notify you about changes to our Service</li>
              <li>• To allow you to participate in interactive features of our Service</li>
              <li>• To provide customer support</li>
              <li>• To gather analysis or valuable information so we can improve our Service</li>
              <li>• To monitor the usage of our Service</li>
              <li>• To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">4. Firebase Storage</h3>
            <p className="mb-4">
              We use Firebase, a service provided by Google, to store your data. Firebase stores your personal information securely in the cloud. Firebase's privacy practices are governed by Google's Privacy Policy. We encourage you to review Google's Privacy Policy to understand how Google handles your data.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">5. Google Authentication</h3>
            <p className="mb-4">
              We use Google Sign-In for authentication. When you sign up or log in using your Google account, we receive certain profile information from Google. This is governed by Google's Privacy Policy and the permissions you grant to CodeLearn.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">6. Security of Data</h3>
            <p className="mb-4">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">7. Changes to This Privacy Policy</h3>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">8. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:pykinsu@outlook.com" className="underline hover:opacity-70">pykinsu@outlook.com</a>
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
