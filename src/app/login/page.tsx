"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="sidebar-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
          <span>🪶</span> Inkwell
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
            <h2 style={{ marginBottom: "0.5rem" }}>Check your email</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Enter your email and we&apos;ll send you a magic link.</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading ? <span className="spinner" /> : "Send magic link ✨"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-faint)" }}>
              New here? Just enter your email — we&apos;ll create your account automatically.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
