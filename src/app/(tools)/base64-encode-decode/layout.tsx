import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encode/Decode",
  description:
    "Encode text to Base64 or decode Base64 strings. Free online tool with instant conversion. No data sent to servers.",
  openGraph: {
    title: "Base64 Encode/Decode | OpenDevTools",
    description: "Encode and decode Base64 strings instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
