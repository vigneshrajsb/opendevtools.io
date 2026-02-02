import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter",
  description:
    "Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds. Free online tool.",
  openGraph: {
    title: "Unix Timestamp Converter | OpenDevTools",
    description: "Convert Unix timestamps to dates and vice versa instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
