import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/lips/i18n/language-context";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIPS - Ligue des Imams et Prédicateurs du Sénégal",
  description:
    "Institution nationale de référence au service des imams, de la communauté et de la paix sociale. Par la patience et la certitude, on atteint l'imamat dans la religion.",
  keywords: [
    "LIPS",
    "Ligue des Imams",
    "Prédicateurs du Sénégal",
    "Islam Sénégal",
    "Imam",
    "Paix sociale",
    "Communauté musulmane",
    "Daawa",
    "Fiqh",
  ],
  authors: [{ name: "LIPS - Ligue des Imams et Prédicateurs du Sénégal" }],
  icons: {
    icon: "/logo-64.png",
  },
  openGraph: {
    title: "Ligue des Imams et Prédicateurs du Sénégal",
    description:
      "Institution nationale de référence au service des imams, de la communauté et de la paix sociale.",
    url: "https://lips.sn",
    siteName: "LIPS",
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIPS - Ligue des Imams et Prédicateurs du Sénégal",
    description:
      "Institution nationale de référence au service des imams et de la communauté.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Auto day/night theme — runs before React to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try{
                var mode=localStorage.getItem('lips-theme-mode');
                if(mode==='auto'||!mode){
                  var h=new Date().toLocaleTimeString('en-GB',{hour:'numeric',hour12:false,timeZone:'Africa/Dakar'});
                  var hr=parseInt(h,10);
                  if(hr>=19||hr<6) document.documentElement.classList.add('dark');
                }else if(mode==='dark'){
                  document.documentElement.classList.add('dark');
                }else if(mode==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches){
                  document.documentElement.classList.add('dark');
                }
                // If auto and no saved mode yet, save it
                if(!mode) localStorage.setItem('lips-theme-mode','auto');
              }catch(e){}
            })()`,
          }}
        />
        {/* Schema.org pour Organisation Institutionnelle */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Ligue des Imams et Prédicateurs du Sénégal",
              alternateName: "LIPS",
              url: "https://lips.sn",
              logo: "https://lips.sn/logo.png",
              description:
                "Institution nationale de référence au service des imams, de la communauté et de la paix sociale.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Grande Mosquée AN-NOUR Liberté II",
                addressLocality: "Dakar",
                addressCountry: "SN",
              },
              foundingDate: "2006",
              areaServed: {
                "@type": "Country",
                name: "Sénégal",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
