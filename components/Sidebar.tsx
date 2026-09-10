import Link from "next/link";
import NavLink from "./NavLink";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 left-0 bg-navy-900 text-white">
      <div className="flex flex-col items-center gap-3 px-6 pt-10 pb-8 border-b border-white/10">
        <Link href="/" className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" width={64} height={64} className="rounded-2xl" />
          <span className="text-center leading-tight">
            <span className="block text-base font-semibold tracking-wide">TRS TRANSACTIONS</span>
            <span className="block text-[11px] text-navy-200 mt-0.5">Suivi &amp; recouvrement</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavLink href="/" label="Tableau de bord" icon="grid" />
        <NavLink href="/transactions" label="Transactions" icon="list" />
        <NavLink href="/transactions/new" label="Nouvelle transaction" icon="plus" />
      </nav>

      <div className="px-6 py-5 border-t border-white/10 text-[11px] text-navy-300">
        TRS Transactions
      </div>
    </aside>
  );
}
