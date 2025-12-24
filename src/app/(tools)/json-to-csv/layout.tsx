import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter",
  description:
    "Convert JSON array to CSV format. Free online tool with instant conversion. No data sent to servers.",
  openGraph: {
    title: "JSON to CSV Converter | OpenDevTools",
    description:
      "Convert JSON array to CSV format instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
