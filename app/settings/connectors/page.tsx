"use client";

const PRESET_CONNECTORS = [
  { id: "google_drive", name: "Google Drive MCP", desc: "Read docs and files from Drive" },
  { id: "slack", name: "Slack MCP", desc: "Search channels and draft replies" },
  { id: "notion", name: "Notion MCP", desc: "Retrieve pages and update notes" },
] as const;

function loadEnabled() {
  if (typeof window === "undefined") return [] as string[];
  const raw = localStorage.getItem("oneclaw_connectors");
  if (!raw) return [] as string[];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [] as string[];
  }
}

export default function ConnectorsPage() {
  const enabled = loadEnabled();
  const toggle = (id: string) => {
    const next = enabled.includes(id) ? enabled.filter((x) => x !== id) : [...enabled, id];
    localStorage.setItem("oneclaw_connectors", JSON.stringify(next));
    window.location.reload();
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Connectors</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Turn on pre-hosted connectors. No JSON setup required.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <div className="space-y-3">
          {PRESET_CONNECTORS.map((connector) => {
            const isEnabled = enabled.includes(connector.id);
            return (
              <div key={connector.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3">
                <div>
                  <p className="font-semibold">{connector.name}</p>
                  <p className="text-sm text-[var(--muted)]">{connector.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(connector.id)}
                  className={`rounded-full px-3 py-1 text-xs ${isEnabled ? "bg-emerald-100 text-emerald-800" : "border border-[var(--line)] text-[var(--muted)]"}`}
                >
                  {isEnabled ? "Enabled" : "Enable"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
