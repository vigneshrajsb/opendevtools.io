import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test and debug regular expressions with live matching, capture groups, and a handy cheatsheet. Free online regex tool.",
  openGraph: {
    title: "Regex Tester | OpenDevTools",
    description:
      "Test regular expressions with live matching and detailed results.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
