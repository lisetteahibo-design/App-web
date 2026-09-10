import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-navy-900 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" width={36} height={36} className="rounded-lg" />
          <span className="text-sm font-semibold tracking-wide">TRS TRANSACTIONS</span>
        </Link>
      </div>
      <nav className="flex items-center gap-1 px-3 pb-3 text-xs">
        <Link href="/" className="rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10">
          Tableau de bord
        </Link>
        <Link href="/transactions" className="rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10">
          Transactions
        </Link>
        <Link href="/transactions/new" className="rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10">
          Nouvelle
        </Link>
      </nav>
    </header>
  );
}
