import { Navbar } from '@/components/Headers/navbar'
import { Footer } from '@/components/Contents/footer'
import './globals.css'
import { RecaptchaProvider } from '@/components/providers/recaptcha'

export const metadata = {
  title: 'PPDB SMAN 3 Palu',
  description: 'Situs Penerimaan Peserta Didik Baru SMAN 3 Palu 2023/2024',
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
