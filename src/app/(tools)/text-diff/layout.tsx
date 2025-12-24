import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Checker",
  description:
    "Compare two text blocks and see differences highlighted. Free online diff tool. No data sent to servers.",
  openGraph: {
    title: "Text Diff Checker | OpenDevTools",
    description:
      "Compare two text blocks and see differences instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
