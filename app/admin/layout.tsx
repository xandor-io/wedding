"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/admin", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/guests", label: "Guests" },
    { href: "/admin/messages", label: "Messages" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ivory)", color: "var(--ink)" }}>
      <header style={{ background: "var(--ivory-warm)", borderBottom: "1px solid rgba(124,138,106,0.2)", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1.1rem" }}>
          Elexus &amp; Xandor
          <span style={{ color: "var(--sage)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginLeft: "0.75rem", fontStyle: "normal" }}>admin</span>
        </div>
        <nav style={{ display: "flex", gap: "1.5rem", marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: active ? "var(--blush-rose)" : "var(--ink-soft)",
                  textDecoration: "none",
                  paddingBottom: "2px",
                  borderBottom: active ? "1px solid var(--blush-rose)" : "1px solid transparent",
                }}
              >{item.label}</Link>
            );
          })}
          <button onClick={logout} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sage)", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            Sign out
          </button>
        </nav>
      </header>
      <main style={{ padding: "2.5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>{children}</main>
    </div>
  );
}
