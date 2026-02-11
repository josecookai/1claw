import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">OpenClaw Cloud</h1>
      <p className="mt-2 text-muted-foreground">OpenClaw as a Service</p>
      <div className="mt-6 flex gap-4">
        <Link href="/onboarding" className="text-primary underline">
          Onboarding
        </Link>
        <Link href="/console" className="text-primary underline">
          Console
        </Link>
      </div>
    </main>
  );
}
