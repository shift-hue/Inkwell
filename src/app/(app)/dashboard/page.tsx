import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTodayPrompt } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch recent entries
  const { data: entries } = await supabase
    .from("entries")
    .select("id, title, content, mood, created_at, word_count, tags")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Stats
  const { count: totalEntries } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: wordData } = await supabase
    .from("entries")
    .select("word_count")
    .eq("user_id", user.id);

  const totalWords = wordData?.reduce((acc, e) => acc + (e.word_count || 0), 0) ?? 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const { count: todayCount } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${todayStr}T00:00:00`);

  const prompt = getTodayPrompt();

  const MOODS: Record<string, { emoji: string; label: string; color: string }> = {
    happy: { emoji: "😊", label: "Happy", color: "var(--mood-happy)" },
    calm: { emoji: "😌", label: "Calm", color: "var(--mood-calm)" },
    sad: { emoji: "😢", label: "Sad", color: "var(--mood-sad)" },
    anxious: { emoji: "😰", label: "Anxious", color: "var(--mood-anxious)" },
    angry: { emoji: "😤", label: "Angry", color: "var(--mood-angry)" },
    meh: { emoji: "😑", label: "Meh", color: "var(--mood-meh)" },
    excited: { emoji: "🤩", label: "Excited", color: "var(--mood-excited)" },
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">
            Good {getTimeOfDay()},{" "}
            {profile?.username ? profile.username.split(" ")[0] : user.email?.split("@")[0]} 👋
          </h1>
          <p className="page-subtitle">
            {todayCount ? "You've written today — keep the streak alive! 🔥" : "You haven't written today yet. The blank page awaits."}
          </p>
        </div>
        <Link href="/write">
          <button className="btn btn-primary">✏️ New Entry</button>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ background: "linear-gradient(135deg,#f5782a,#f5c842)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {profile?.current_streak ?? 0}🔥
          </div>
          <div className="stat-label">Day streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--accent)" }}>{totalEntries ?? 0}</div>
          <div className="stat-label">Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--success)" }}>{formatNumber(totalWords)}</div>
          <div className="stat-label">Words written</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--gold)" }}>{profile?.longest_streak ?? 0}</div>
          <div className="stat-label">Best streak</div>
        </div>
      </div>

      {/* Daily prompt */}
      <div className="prompt-card">
        <div className="prompt-label">💡 Today&apos;s prompt</div>
        <p className="prompt-text">&ldquo;{prompt}&rdquo;</p>
        <Link href={`/write?prompt=${encodeURIComponent(prompt)}`} style={{ display: "inline-block", marginTop: "0.75rem" }}>
          <button className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}>
            Write from this prompt →
          </button>
        </Link>
      </div>

      {/* Recent entries */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Recent entries</h2>
        <Link href="/entries" style={{ fontSize: "0.85rem", color: "var(--accent)" }}>View all →</Link>
      </div>

      {entries && entries.length > 0 ? (
        entries.map((entry) => {
          const mood = entry.mood ? MOODS[entry.mood] : null;
          return (
            <Link href={`/write?id=${entry.id}`} key={entry.id}>
              <div className="entry-card">
                <div className="entry-title">{entry.title || "Untitled entry"}</div>
                <div className="entry-meta">
                  <span>{new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                  {entry.word_count > 0 && <span>{entry.word_count} words</span>}
                  {mood && (
                    <span className="mood-pill" style={{ color: mood.color, background: `${mood.color}18` }}>
                      {mood.emoji} {mood.label}
                    </span>
                  )}
                </div>
                {entry.content && (
                  <p className="entry-preview">{stripHtml(entry.content)}</p>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="icon">📖</div>
          <h3>No entries yet</h3>
          <p>Your first entry is waiting to be written.</p>
          <Link href="/write">
            <button className="btn btn-primary" style={{ marginTop: "1rem" }}>Write your first entry</button>
          </Link>
        </div>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
