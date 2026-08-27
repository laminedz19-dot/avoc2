import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AchriProvider } from '@/context/AchriContext';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';

export const viewport: Viewport = {
  themeColor: '#0F766E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'AchriDZ – سوق المستعمل في الجزائر | Marketplace 69 Wilayas',
  description:
    'منصة جزائرية موثوقة لبيع وشراء المنتجات المستعملة مع نظام التحقق من رسوم النشر 200 دج ومكافحة الاحتيال في 69 ولاية جزائرية.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AchriDZ',
  },
  icons: {
    icon: '/icons/app-icon.png',
    apple: '/icons/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">
        <AchriProvider>
          <Navigation />
          <AuthModal />
          <main className="min-h-[calc(100vh-140px)]">{children}</main>
          <footer className="bg-slate-900 text-slate-400 py-10 px-4 border-t border-slate-800 text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                    DZ
                  </div>
                  <span className="font-extrabold text-white text-base">
                    AchriDZ – سوق المستعمل
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  المنصة الجزائرية الأولى للبيع والشراء مع حماية موثوقة ونظام
                  رسوم نشر إلزامي وثابت بقيمة 200 دج في 69 ولاية جزائرية.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2.5">روابط سريعة</h4>
                <ul className="space-y-1.5 text-xs">
                  <li>
                    <a href="/create" className="hover:text-amber-400 transition">
                      + نشر إعلان جديد (200 دج)
                    </a>
                  </li>
                  <li>
                    <a href="/search" className="hover:text-amber-400 transition">
                      البحث والفلاتر في 69 ولاية
                    </a>
                  </li>
                  <li>
                    <a href="/payment-guide" className="hover:text-amber-400 transition">
                      طريقة الدفع ومعلومات بريد الجزائر CCP
                    </a>
                  </li>
                  <li>
                    <a href="/messages" className="hover:text-amber-400 transition">
                      الرسائل والتفاوض المباشر
                    </a>
                  </li>
                  <li>
                    <a href="/release" className="hover:text-amber-400 font-extrabold text-amber-300 transition">
                      ★ مركز النشر (Google Play & GitHub)
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2.5">
                  قاعدة النظام المالي (200 DZD)
                </h4>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
                  <p className="text-amber-400 font-bold">
                    ✓ رسوم النشر ثابتة: 200 دج لكل إعلان
                  </p>
                  <p className="text-slate-300">
                    لا يظهر أي إعلان للعامة قبل تأكيد دفع 200 دج لحساب CCP أو BaridiMob.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2.5">الأمان ومنع التحايل</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  لا تطلب المنصة أبدًا كلمة السر الخاصة بحساب CCP أو رمز البطاقة الذهبية أو تطبيق BaridiMob.
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href="/admin/payments"
                    className="px-3 py-1.5 bg-teal-800/80 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition"
                  >
                    لوحة الإدارة CCP
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>© 2026 AchriDZ Marketplace Algérie • صنع للجزائريين في 69 ولاية</span>
              <span>العملة الرسمية: الدينار الجزائري (DZD)</span>
            </div>
          </footer>
        </AchriProvider>
      </body>
    </html>
  );
}
