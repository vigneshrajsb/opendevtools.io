import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mermaid Diagram Preview",
  description:
    "Render Mermaid diagrams with a live preview. Free online Mermaid previewer. No data sent to servers.",
  openGraph: {
    title: "Mermaid Diagram Preview | OpenDevTools",
    description: "Render Mermaid diagrams instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
