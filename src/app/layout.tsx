import { Navbar } from '@/components/Headers/navbar'
import { Footer } from '@/components/Contents/footer'
import './globals.css'
import { NisnSharedProvider } from '@/components/Contents/nisn_shared'

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
          <NisnSharedProvider>
            {children}
          </NisnSharedProvider>
        <Footer />
      </body>
    </html>
  )
}
