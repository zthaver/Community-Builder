import type { Metadata } from 'next';
import ReduxProvider from '../store/ReduxProvider';
import { Geist, Geist_Mono, Josefin_Sans, Nunito_Sans } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar/Navbar';
import ScreenMagnifier from './components/ScreenMagnifier';
import { PostHogProvider } from './providers'
import AuthProvider from './auth/confirm/AuthProvider';

const josefinSans = Josefin_Sans({
  variable: '--font--josefin-sans',
  subsets: ['latin'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font--nunito-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Community Builder - A Community for Seniors',
  description: 'A warm and welcoming online community designed especially for seniors. Connect with others, stay informed, and participate in events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.className} antialiased`}>
        <PostHogProvider>
          <ReduxProvider>
            {/* Skip to main content link for keyboard users */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:text-lg focus:font-semibold focus:rounded-lg focus:shadow-lg"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
            {/* Screen magnifier for accessibility */}
            <ScreenMagnifier />
          </ReduxProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
