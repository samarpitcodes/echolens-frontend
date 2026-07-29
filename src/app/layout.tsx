import type { Metadata } from "next";
import "./globals.css";
import { AuthGate, AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "EchoLens — Research Once. Build Smarter.",
  description: "AI-powered research memory and project architect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-bg text-text antialiased">
        <AuthProvider><AuthGate>{children}</AuthGate></AuthProvider>
      </body>
    </html>
  );
}
