import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description:
    "Generate placeholder text for your designs and mockups. Free online lorem ipsum generator. No data sent to servers.",
  openGraph: {
    title: "Lorem Ipsum Generator | OpenDevTools",
    description: "Generate placeholder text instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
