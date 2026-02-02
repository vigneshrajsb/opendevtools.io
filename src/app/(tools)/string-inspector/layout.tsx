import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "String Inspector",
  description:
    "Analyze text strings: character counts, byte size, encoding detection, and word frequency distribution. Free online tool.",
  openGraph: {
    title: "String Inspector | OpenDevTools",
    description: "Analyze text strings with character counts, encoding detection, and word distribution.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
