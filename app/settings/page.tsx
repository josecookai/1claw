"use client";

import Link from "next/link";
import { useState } from "react";
import { hasApiKeyVault, loadApiKeys, saveApiKeys } from "@/lib/api-key-vault";
import { loadSelection } from "@/lib/product-pages";

export default function SettingsPage() {
  const s = loadSelection();
  const [passphrase, setPassphrase] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [vaultExists, setVaultExists] = useState(typeof window !== "undefined" ? hasApiKeyVault() : false);

  const saveKey = async () => {
    if (!passphrase || passphrase.length < 8) {
      setError("Passphrase must be at least 8 characters.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveApiKeys(passphrase, { anthropic: anthropicKey.trim() });
      setVaultExists(true);
      setMessage("Saved locally with encryption (AES-GCM).");
    } catch {
      setError("Failed to encrypt and save key.");
    } finally {
      setSaving(false);
    }
  };

  const loadKey = async () => {
    if (!passphrase) {
      setError("Enter passphrase to unlock.");
      return;
    }
    setError("");
    try {
      const keys = await loadApiKeys(passphrase);
      setAnthropicKey(keys.anthropic ?? "");
      setMessage("Local key unlocked.");
    } catch {
      setError("Incorrect passphrase or corrupted local vault.");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Manage plan and product preferences.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Plan</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Current plan: {s.plan === "max_200" ? "Pro" : "Starter"}</p>
        <Link href="/pricing" className="mt-3 inline-block rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">Upgrade</Link>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Connectors</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Connector settings are managed separately.</p>
        <Link href="/settings/connectors" className="mt-3 inline-block text-sm text-[var(--ink)] underline">Open connectors</Link>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">API Key Vault (Local only)</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Your key is encrypted in your browser localStorage and not sent to 1Claw backend.
        </p>
        <div className="mt-3 grid gap-2">
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase (>=8 chars)"
            className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
            placeholder="Anthropic API Key"
            className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={saveKey}
            disabled={saving}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save local key"}
          </button>
          <button type="button" onClick={loadKey} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">
            Unlock key
          </button>
          {vaultExists ? <span className="self-center text-xs text-emerald-700">Encrypted vault found</span> : null}
        </div>
        {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </section>
    </main>
  );
}
