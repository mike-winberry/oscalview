import { metadata as AppMetadata } from '@/lib/metadata';
export const metadata = AppMetadata;

import ClientLayout from './client-layout';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
