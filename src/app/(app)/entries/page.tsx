"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MOODS } from "@/components/MoodPicker";

type Entry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  word_count: number;
  created_at: string;
};

const MOOD_MAP = Object.fromEntries(MOODS.map(m => [m.key, m]));

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    const { data } = await supabase
      .from("entries")
      .select("id, title, content, mood, tags, word_count, created_at")
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || [])));

  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (e.title || "").toLowerCase().includes(q) ||
      stripHtml(e.content || "").toLowerCase().includes(q) ||
      (e.tags || []).some(t => t.toLowerCase().includes(q));
    const matchTag = !activeTag || (e.tags || []).includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">All Entries</h1>
          <p className="page-subtitle">{entries.length} total entries</p>
        </div>
        <Link href="/write">
          <button className="btn btn-primary">✏️ New Entry</button>
        </Link>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search entries…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag`}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              style={activeTag === tag ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}><span className="spinner" /></div>
      ) : filtered.length > 0 ? (
        filtered.map(entry => {
          const mood = entry.mood ? MOOD_MAP[entry.mood] : null;
          return (
            <Link href={`/write?id=${entry.id}`} key={entry.id}>
              <div className="entry-card">
                <div className="entry-title">{entry.title || "Untitled entry"}</div>
                <div className="entry-meta">
                  <span>{new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
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
                {entry.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {entry.tags.map(t => <span key={t} className="tag">#{t}</span>)}
                  </div>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>{search ? "No results found" : "No entries yet"}</h3>
          <p>{search ? "Try a different search term." : "Start writing and your entries will appear here."}</p>
          {!search && (
            <Link href="/write">
              <button className="btn btn-primary" style={{ marginTop: "1rem" }}>Write first entry</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
