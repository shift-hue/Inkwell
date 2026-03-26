"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/write", label: "Write", icon: "✏️" },
  { href: "/entries", label: "All Entries", icon: "📚" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🪶</span> Inkwell
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname.startsWith(href) ? "active" : ""}`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", padding: "0 0.75rem", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.email}
          </p>
          <button onClick={handleSignOut} className="nav-link btn-danger" style={{ width: "100%", border: "none", background: "transparent", textAlign: "left" }}>
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">{children}</main>
    </div>
  );
}
