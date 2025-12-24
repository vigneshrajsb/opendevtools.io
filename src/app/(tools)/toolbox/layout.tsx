import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Developer Tools",
  description:
    "Browse all free online developer tools. JSON, YAML, CSV converters, text diff, URL encoder, and more. All processing happens in your browser.",
  openGraph: {
    title: "All Developer Tools | OpenDevTools",
    description:
      "Browse all free online developer tools. No data sent to servers.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
