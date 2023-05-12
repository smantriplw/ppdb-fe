import { Navbar } from '@/components/Headers/navbar'
import { Footer } from '@/components/Contents/footer'
import './globals.css'
import { RecaptchaProvider } from '@/components/providers/recaptcha'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PPDB SMAN 3 Palu',
  description: 'Situs Penerimaan Peserta Didik Baru SMAN 3 Palu 2023/2024',
  authors: {
    name: 'Hanif Dwy Putra S',
    url: 'https://github.com/hansputera',
  },
  creator: 'SMAN 3 Palu',
  keywords: [
    'sman 3 palu',
    'sma negeri 3 palu',
    'ppdb sman 3 palu',
    'sma 3',
    'sma 3 palu',
    'sman tiga palu',
    'sman tiga',
    'sma negeri tiga palu',
    'sman 3 plw',
    'sma 3 plw',
    'sma negeri tiga plw',
    'smantri palu',
    'ppdb smantri palu',
    'ppdb sman 3 plw',
    'ppdb sma negeri 3 palu',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  applicationName: 'PPDB SMAN 3 Palu',
  abstract: 'PPDB SMAN 3 Palu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Navbar />
          <RecaptchaProvider token={process.env.RECAPTCHA_KEY!}>
            {children}
          </RecaptchaProvider>
        <Footer />
      </body>
    </html>
  )
}
