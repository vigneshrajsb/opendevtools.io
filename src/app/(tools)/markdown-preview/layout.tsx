import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview",
  description:
    "Preview markdown with live rendering. Free online markdown editor and previewer. No data sent to servers.",
  openGraph: {
    title: "Markdown Preview | OpenDevTools",
    description: "Preview markdown with live rendering in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
