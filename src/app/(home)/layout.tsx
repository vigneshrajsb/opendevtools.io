import { HomeNavbar } from "@/components/layout/home-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenDevTools - Free Online Developer Tools",
  description:
    "Free, open-source developer tools that run entirely in your browser. JSON, YAML, CSV converters, text diff, URL encoder, and more. No data sent to servers.",
  openGraph: {
    title: "OpenDevTools - Free Online Developer Tools",
    description:
      "Free, open-source developer tools that run entirely in your browser. No data sent to servers.",
  },
};

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
