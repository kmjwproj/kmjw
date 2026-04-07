export default function TopHeader() {
  return (
    <header className="fixed top-0 max-w-120 w-full left-0 right-0 mx-auto h-14 z-50 flex items-center px-4 bg-background/90 backdrop-blur-xl border-b border-border/50">
      {/* 로고 영역 */}
      <div className="h-7 w-20 rounded bg-muted text-3xl text-zinc-400">kmjw</div>
    </header>
  )
}
