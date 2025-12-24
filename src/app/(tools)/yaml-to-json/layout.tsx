import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter",
  description:
    "Convert YAML data to JSON format. Free online tool with instant conversion. No data sent to servers.",
  openGraph: {
    title: "YAML to JSON Converter | OpenDevTools",
    description: "Convert YAML data to JSON format instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
