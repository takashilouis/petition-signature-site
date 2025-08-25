import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Petition For Change - Make Your Voice Heard',
  description: 'Join thousands of others in signing this important petition for change.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'PetitionForChange';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com';

  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link 
                  href="/" 
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {siteName}
                </Link>
                <nav className="hidden sm:flex space-x-6">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/petition" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign Petition
                  </Link>
                  <Link 
                    href="/verify" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Verify
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  © 2025 {siteName}. All rights reserved.
                </div>
                <nav className="flex space-x-6">
                  <Link 
                    href="/privacy" 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Terms
                  </Link>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Contact
                  </a>
                </nav>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}