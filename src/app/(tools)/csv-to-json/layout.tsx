import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter",
  description:
    "Convert CSV data to JSON format. Free online tool with instant conversion. No data sent to servers.",
  openGraph: {
    title: "CSV to JSON Converter | OpenDevTools",
    description: "Convert CSV data to JSON format instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
