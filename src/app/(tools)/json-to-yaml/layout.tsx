import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to YAML Converter",
  description:
    "Convert JSON data to YAML format. Free online tool with instant conversion. No data sent to servers.",
  openGraph: {
    title: "JSON to YAML Converter | OpenDevTools",
    description: "Convert JSON data to YAML format instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
