import {
  FileJson,
  FileCode,
  FileSpreadsheet,
  Link2,
  GitCompare,
  Type,
  FileText,
  Code2,
  WrapText,
  Binary,
  KeyRound,
  Clock,
  TextSearch,
  Regex,
  Link,
  Workflow,
} from "lucide-react";

export const tools = [
  {
    name: "JSON to YAML",
    path: "/json-to-yaml",
    description: "Convert JSON data to YAML format",
    icon: FileJson,
  },
  {
    name: "YAML to JSON",
    path: "/yaml-to-json",
    description: "Convert YAML data to JSON format",
    icon: FileCode,
  },
  {
    name: "JSON Format",
    path: "/json-format",
    description: "Format and validate JSON data",
    icon: FileCode,
  },
  {
    name: "CSV to JSON",
    path: "/csv-to-json",
    description: "Convert CSV data to JSON format",
    icon: FileSpreadsheet,
  },
  {
    name: "JSON to CSV",
    path: "/json-to-csv",
    description: "Convert JSON array to CSV format",
    icon: FileSpreadsheet,
  },
  {
    name: "URL Encode/Decode",
    path: "/url-encode-decode",
    description: "Encode or decode URL strings",
    icon: Link2,
  },
  {
    name: "Text Diff Checker",
    path: "/text-diff",
    description: "Compare two text blocks and see differences",
    icon: GitCompare,
  },
  {
    name: "Lorem Ipsum Generator",
    path: "/lorem-ipsum",
    description: "Generate placeholder text",
    icon: Type,
  },
  {
    name: "Markdown Preview",
    path: "/markdown-preview",
    description: "Preview markdown with live rendering",
    icon: FileText,
  },
  {
    name: "Mermaid Diagram Preview",
    path: "/mermaid-preview",
    description: "Render Mermaid diagrams with live preview",
    icon: Workflow,
  },
  {
    name: "JavaScript Sandbox",
    path: "/js-sandbox",
    description: "Execute JavaScript code in a sandboxed environment",
    icon: Code2,
  },
  {
    name: "Escape/Unescape Newlines",
    path: "/escape-newlines",
    description: "Escape or unescape newline characters in text",
    icon: WrapText,
  },
  {
    name: "Base64 Encode/Decode",
    path: "/base64-encode-decode",
    description: "Encode text to Base64 or decode Base64 strings",
    icon: Binary,
  },
  {
    name: "JWT Debugger",
    path: "/jwt-debugger",
    description: "Decode and verify JSON Web Tokens",
    icon: KeyRound,
  },
  {
    name: "Unix Timestamp",
    path: "/unix-timestamp",
    description: "Convert between Unix timestamps and dates",
    icon: Clock,
  },
  {
    name: "String Inspector",
    path: "/string-inspector",
    description: "Analyze text: character counts, encoding, and word distribution",
    icon: TextSearch,
  },
  {
    name: "Regex Tester",
    path: "/regex-tester",
    description: "Test and debug regular expressions with live matching",
    icon: Regex,
  },
  {
    name: "URL Parser",
    path: "/url-parser",
    description: "Parse and analyze URL components and query parameters",
    icon: Link,
  },
] as const;

export type ToolPath = (typeof tools)[number]["path"];
export type Tool = (typeof tools)[number];
