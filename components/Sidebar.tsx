import Link from "next/link";
import NavLink from "./NavLink";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 left-0 bg-white border-r border-gray-200">
      <div className="flex flex-col items-center gap-4 px-6 pt-10 pb-8 border-b border-gray-100">
        <Link href="/" className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="EDEN Capital" width={176} height={55} />
          <span className="text-center leading-tight">
            <span className="block text-base font-semibold tracking-wide text-navy-900">TRS TRANSACTIONS</span>
            <span className="block text-[11px] text-gray-400 mt-0.5">Suivi &amp; recouvrement</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavLink href="/" label="Tableau de bord" icon="grid" />
        <NavLink href="/transactions" label="Transactions" icon="list" />
        <NavLink href="/transactions/new" label="Nouvelle transaction" icon="plus" />
      </nav>

      <div className="px-6 py-5 border-t border-gray-100 text-[11px] text-gray-400">
        TRS Transactions
      </div>
    </aside>
  );
}
