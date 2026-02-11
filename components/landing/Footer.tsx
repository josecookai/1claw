export default function Footer() {
  const shareText = encodeURIComponent("I just found 1Claw: own an AI Agent in 1 minute.");
  const shareUrl = encodeURIComponent("https://1claw.vercel.app");
  return (
    <footer className="border-t border-black/5 bg-[#f7f6f3]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 text-sm text-black/50">
        <div>© {new Date().getFullYear()} 1Claw</div>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs hover:border-black/30"
        >
          Share on X
        </a>
      </div>
    </footer>
  );
}
