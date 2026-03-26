import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="sidebar-logo" style={{ margin: 0 }}>
          <span>🪶</span> Inkwell
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/login">
            <button className="btn btn-ghost">Sign in</button>
          </Link>
          <Link href="/login">
            <button className="btn btn-primary">Start journaling →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-badge">✨ Your story, beautifully kept</div>
        <h1 className="hero-title">
          Write every day.<br />Discover yourself.
        </h1>
        <p className="hero-sub">
          Inkwell is a private, beautiful journal that helps you reflect, track
          your mood, build writing streaks, and rediscover your own words.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login">
            <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
              Start your journal — it&apos;s free
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="feature-grid">
          {[
            { icon: "🔥", title: "Writing Streaks", desc: "Build a daily habit. Track your streak and celebrate every milestone." },
            { icon: "🌤", title: "Mood Tracking", desc: "Log how you feel with each entry. See your emotional patterns over time." },
            { icon: "💡", title: "Daily Prompts", desc: "Never stare at a blank page. A fresh writing prompt greets you every day." },
            { icon: "🔍", title: "Full-text Search", desc: "Find any entry, memory, or moment instantly across your entire journal." },
            { icon: "🏷", title: "Tags & Topics", desc: "Organize entries by themes. Filter and browse by what matters to you." },
            { icon: "🔒", title: "Private by design", desc: "Your entries are only visible to you. No ads, no sharing, no compromise." },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "var(--text-faint)", fontSize: "0.85rem", borderTop: "1px solid var(--border)" }}>
        Built with 🪶 by Inkwell • Free forever
      </footer>
    </div>
  );
}
