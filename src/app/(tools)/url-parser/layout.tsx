import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Parser",
  description:
    "Parse and analyze URL components and query parameters. Free online URL parsing tool.",
  openGraph: {
    title: "URL Parser | OpenDevTools",
    description:
      "Parse and analyze URL structure and query parameters instantly.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
