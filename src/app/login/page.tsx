"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { EchoMark } from "@/components/echo-mark";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (isRegistering && name.trim().length < 2) return setError("Enter your name.");
    if (password.length < 6) return setError("Use at least 6 characters for your password.");
    setLoading(true);
    try {
      if (isRegistering) await register(name, email, password);
      else await signIn(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><EchoMark className="h-11 w-11 rounded-xl"/><div><strong>EchoLens</strong><span>Research once. Build smarter.</span></div></div><div className="auth-heading"><h1>{isRegistering ? "Create your workspace" : "Welcome back"}</h1><p>{isRegistering ? "Your account is saved securely in this browser." : "Sign in to continue to your research workspace."}</p></div><form onSubmit={submit} className="auth-form">{isRegistering && <label><span>Name</span><div><UserRound size={17}/><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name"/></div></label>}<label><span>Email</span><div><Mail size={17}/><input required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" autoComplete="email"/></div></label><label><span>Password</span><div><LockKeyhole size={17}/><input required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" type="password" autoComplete={isRegistering ? "new-password" : "current-password"}/></div></label>{error && <p className="auth-error">{error}</p>}<button className="auth-submit" disabled={loading}>{loading ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}<ArrowRight size={17}/></button></form><p className="auth-switch">{isRegistering ? "Already have an account?" : "New to EchoLens?"}<button onClick={() => { setIsRegistering(!isRegistering); setError(""); }}>{isRegistering ? "Sign in" : "Create an account"}</button></p><p className="auth-note">Google sign-in needs a Google OAuth client ID and a backend callback. This local account flow is fully working without changing your environment.</p></section></main>;
}
