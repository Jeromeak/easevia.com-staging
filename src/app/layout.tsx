import RouteLoading from '@/common/components/Loading';
import './globals.css';
import '../common/components/date-picker.css';
import { ThemeProviderClient } from './ThemeProviderClient';
import { AuthProvider } from '@/context/AuthContext';
import { AuthFlowProvider } from '@/context/AuthFlowContext';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { UserInitializer } from '@/common/components/UserInitializer';
import { LanguageCurrencyProvider } from '@/context/LanguageCurrencyContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { GlobalAuthModals } from '@/common/components/GlobalAuthModals';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Easevia – Unlock Seamless Travel with Flight Credits Subscription',
  description:
    'Experience effortless travel with Easevia. Choose your plan, earn flight credits every month, and book flights instantly. Simple, flexible, and made for frequent flyers',
  keywords: [
    'easevia, flight subscription, seamless travel, book flights instantly, flight credits, travel plans, affordable air travel, travel subscription, easy flight booking, earn travel credits',
  ],
  authors: [{ name: 'Your Name or Company' }],
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: 'Easevia – Unlock Seamless Travel with Flight Credits Subscription',
    // description: 'A brief description for social previews.',
    // url: 'https://your-domain.com',
    // siteName: 'Your App Site Name',
    // type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth  scroll-pt-[8vh]" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                }
                // If no stored preference, let the system/user preference take precedence
              })();
            `,
          }}
        />
      </head>
      <body
        className="transition-all dark:text-white dark:bg-black bg-white text-black duration-500 ease-in-out"
        suppressHydrationWarning
      >
        <ThemeProviderClient />
        <RouteLoading />
        <AuthProvider>
          <UserInitializer />
          <AuthFlowProvider>
            <AuthModalProvider>
              <LanguageCurrencyProvider>
                <CheckoutProvider>
                  {children}
                  <GlobalAuthModals />
                </CheckoutProvider>
              </LanguageCurrencyProvider>
            </AuthModalProvider>
          </AuthFlowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
