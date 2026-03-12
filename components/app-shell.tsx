"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  ClipboardPenLine,
  LayoutDashboard,
  LogIn,
  Shield,
  Trophy,
  UserCircle2
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/record", label: "Log Game", icon: ClipboardPenLine },
  { href: "/analysis", label: "Analysis", icon: BarChart3 },
  { href: "/league", label: "League", icon: CalendarDays },
  { href: "/me", label: "My Page", icon: UserCircle2 }
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="font-display text-2xl font-bold tracking-tight text-white">
              ROLLING STONES
            </Link>
            <p className="text-xs text-slate-400">The Bowling Club Growth Platform</p>
          </div>
          <nav className="hidden gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={"/admin" as Route}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
            <Link
              href={"/login" as Route}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
