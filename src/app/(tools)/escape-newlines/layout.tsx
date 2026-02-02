import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escape/Unescape Newlines",
  description:
    "Escape or unescape newline characters in text. Convert between literal newlines and escaped \\n sequences. Free online tool.",
  openGraph: {
    title: "Escape/Unescape Newlines | OpenDevTools",
    description: "Escape or unescape newline characters in text instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
