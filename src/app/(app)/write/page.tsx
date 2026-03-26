"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import MoodPicker from "@/components/MoodPicker";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get("id");
  const promptText = searchParams.get("prompt");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(promptText ? `<p>${promptText}</p>` : "");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!entryId) return;
    supabase.from("entries").select("*").eq("id", entryId).single().then(({ data }) => {
      if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setMood(data.mood || "");
        setTags((data.tags || []).join(", "));
        setWordCount(data.word_count || 0);
      }
    });
  }, [entryId]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean);
    const today = new Date().toISOString().split("T")[0];

    if (entryId) {
      await supabase.from("entries").update({
        title, content, mood, tags: tagArr, word_count: wordCount,
        updated_at: new Date().toISOString(),
      }).eq("id", entryId);
    } else {
      await supabase.from("entries").insert({
        user_id: user.id, title, content, mood, tags: tagArr, word_count: wordCount,
      });

      // Update streak
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile) {
        const lastEntry = profile.last_entry_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = 1;
        if (lastEntry === yesterdayStr) newStreak = (profile.current_streak || 0) + 1;
        else if (lastEntry === today) newStreak = profile.current_streak || 1;

        await supabase.from("profiles").update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, profile.longest_streak || 0),
          last_entry_date: today,
        }).eq("id", user.id);
      }
    }

    setSaving(false);
    setSaved(true);
    showToast(entryId ? "✅ Entry updated" : "✅ Entry saved!");
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!entryId || !confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    await supabase.from("entries").delete().eq("id", entryId);
    router.push("/entries");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="page-title">{entryId ? "Edit entry" : "New entry"}</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {entryId && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "🗑 Delete"}
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" /> : saved ? "✅ Saved" : "💾 Save entry"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Title */}
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            placeholder="Give your entry a title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Editor */}
        <div>
          <label className="label">Your thoughts</label>
          <Editor
            content={content}
            onChange={(html, wc) => { setContent(html); setWordCount(wc); }}
            placeholder="Start writing… let it all out 🪶"
          />
          <p style={{ fontSize: "0.8rem", color: "var(--text-faint)", marginTop: "0.4rem", textAlign: "right" }}>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </p>
        </div>

        {/* Mood */}
        <div>
          <label className="label">How are you feeling?</label>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags (comma-separated)</label>
          <input
            className="input"
            placeholder="gratitude, work, family…"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading…</div>}>
      <WritePageContent />
    </Suspense>
  );
}
