import BottomTabBar from '@/src/widgets/bottom-tab-bar';
import { HeaderNav } from '@/src/widgets/header-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderNav />
      <main className="px-3 pt-16 pb-16">{children}</main>
      <BottomTabBar />
    </>
  );
}
