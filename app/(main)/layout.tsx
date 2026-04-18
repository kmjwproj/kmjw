import { BottomTabBar } from '@/src/widgets/bottom-tab-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative mx-auto min-h-screen max-w-120 bg-white">
        <main className="px-4 pt-16 pb-24">{children}</main>
        <BottomTabBar />
      </div>
    </>
  );
}
