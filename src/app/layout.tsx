import { metadata as AppMetadata } from '@/lib/metadata';
export const metadata = AppMetadata;

import ClientLayout from './client-layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>{children}</div>
    </ClientLayout>
  );
}
