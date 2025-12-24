import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript Sandbox",
  description:
    "Execute JavaScript code in a sandboxed environment. Free online JS playground. No data sent to servers.",
  openGraph: {
    title: "JavaScript Sandbox | OpenDevTools",
    description:
      "Execute JavaScript code safely in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
