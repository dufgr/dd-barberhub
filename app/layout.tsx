import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./_components/footer";
import AuthProvider from "./_providers/auth";
import { Toaster } from "./_components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DD Barber Hub | Agende seu próximo corte",
  description: "Encontre barbearias, consulte serviços e agende seu próximo atendimento.",
};

// Mantém o shell full-width para cada rota centralizar apenas o próprio conteúdo.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} dark min-h-screen`}>
        <AuthProvider>
          <div className="flex min-h-screen w-full flex-col">
            <div className="flex-1">{children}</div>
            <Toaster />
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
