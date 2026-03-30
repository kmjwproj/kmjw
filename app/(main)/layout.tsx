import TopHeader from '@/src/widgets/top-header'
import BottomTabBar from '@/src/widgets/bottom-tab-bar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopHeader />
      <main className="h-screen overflow-y-auto pt-14 pb-16">{children}</main>
      <BottomTabBar />
    </>
  )
}
