"use client";

import { useTransition } from "react";

export default function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          onChange(next);
        });
      }}
      className="rounded-full border-0 bg-gray-100 px-2.5 py-1 text-xs font-medium text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-600 disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
