import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, beautify, and validate JSON data. Free online tool with syntax highlighting. No data sent to servers.",
  openGraph: {
    title: "JSON Formatter & Validator | OpenDevTools",
    description:
      "Format, beautify, and validate JSON data instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
