"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(loginAction, {} as { error?: string; email?: string });
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-900 p-4">
      <form action={action} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-green-900">IPMA KSA admin</h1>
        <p className="mt-1 text-sm text-ink/70">Sign in to manage the website content.</p>
        <label className="mt-6 block text-sm font-semibold">Email
          <input name="email" type="email" required autoComplete="username" defaultValue={state.email} className="mt-1 w-full rounded-xl border border-green-100 px-4 py-3" />
        </label>
        <label className="mt-4 block text-sm font-semibold">Password
          <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-green-100 px-4 py-3" />
        </label>
        {state.error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{state.error}</p>}
        <button disabled={pending} className="btn btn-green mt-6 w-full disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
