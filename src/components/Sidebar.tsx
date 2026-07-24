"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  title: string;
  items: { label: string; href: string; icon: React.ReactNode }[];
}

export default function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[64px] bottom-0 w-60 border-r border-gray-200 bg-gray-50">
      <div className="px-4 py-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h2>
      </div>
      <nav className="px-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-violet-600" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
