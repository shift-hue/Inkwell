"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    const supabase = createClient();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Auto sign-in (if confirm email is disabled)
        router.push("/dashboard");
      } else {
        setMessage("Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh(); // Refresh layout to grab new session
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="sidebar-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
          <span>🪶</span> Inkwell
        </div>

        {message ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
            <h2 style={{ marginBottom: "0.5rem" }}>Almost there!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {message}
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-title">{isSignUp ? "Create an account" : "Welcome back"}</h1>
            <p className="auth-sub">
              {isSignUp ? "Start your journaling journey today." : "Enter your email and password to sign in."}
            </p>

            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
              
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ fontFamily: "monospace" }}
                />
              </div>

              {error && (
                <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading ? <span className="spinner" /> : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-faint)" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
