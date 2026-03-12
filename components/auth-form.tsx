"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: mode === "login" ? "captain@rollingstones.club" : "",
    password: mode === "login" ? "bowling123!" : ""
  });

  const isLogin = mode === "login";
  const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(payload.message ?? "Something went wrong.");
        return;
      }

      setMessage(payload.message ?? "Success.");
      router.push("/admin" as Route);
      router.refresh();
    } catch {
      setMessage("Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel-light mx-auto w-full max-w-5xl overflow-hidden">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Rolling Stones Access</p>
          <h1 className="mt-3 font-display text-4xl font-bold">
            {isLogin ? "Sign in to keep your stats moving" : "Create your club account"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {isLogin
              ? "Use the demo captain account now, then replace it with real users once Prisma and Postgres are connected."
              : "In demo mode, signup works instantly. With DATABASE_URL set, the same form writes to Prisma users."}
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Demo credentials</p>
            <p className="mt-3 text-sm text-slate-300">Admin: captain@rollingstones.club / bowling123!</p>
            <p className="mt-2 text-sm text-slate-300">Member: member@rollingstones.club / bowling123!</p>
          </div>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isLogin ? (
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className={inputClass}
                  placeholder="Rolling Stones Member"
                  required
                />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className={inputClass}
                placeholder="captain@rollingstones.club"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className={inputClass}
                placeholder="bowling123!"
                minLength={8}
                required
              />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                <LogIn className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isLogin ? "Sign in" : "Create account"}
            </button>
            {message ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950";
