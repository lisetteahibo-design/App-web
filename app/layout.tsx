import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export const metadata: Metadata = {
  title: "TRS Transactions",
  description: "Suivi des transactions TRS et opérations de cession/recouvrement de créances",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <Sidebar />
        <MobileHeader />
        <div className="md:pl-64">
          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
