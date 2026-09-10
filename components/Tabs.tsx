"use client";

import { useState, type ReactNode } from "react";

export default function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; badge?: number; content: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab?.id === tab.id
                ? "border-navy-800 text-navy-900"
                : "border-transparent text-gray-500 hover:text-navy-700"
            }`}
          >
            {tab.label}
            {typeof tab.badge === "number" && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
}
