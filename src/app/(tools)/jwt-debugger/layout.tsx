import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Debugger",
  description:
    "Decode and verify JSON Web Tokens. Inspect JWT headers, payloads, and verify signatures. Free online tool.",
  openGraph: {
    title: "JWT Debugger | OpenDevTools",
    description: "Decode and verify JSON Web Tokens instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
