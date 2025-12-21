import { HomeNavbar } from "@/components/layout/home-navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
