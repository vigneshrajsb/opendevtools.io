export const tools = [
  { name: "JSON to YAML", path: "/json-to-yaml" },
  { name: "YAML to JSON", path: "/yaml-to-json" },
  { name: "JSON Format", path: "/json-format" },
  { name: "CSV to JSON", path: "/csv-to-json" },
  { name: "JSON to CSV", path: "/json-to-csv" },
  { name: "URL Encode/Decode", path: "/url-encode-decode" },
  { name: "Text Diff Checker", path: "/text-diff" },
  { name: "Lorem Ipsum Generator", path: "/lorem-ipsum" },
  { name: "Markdown Preview", path: "/markdown-preview" },
  { name: "JavaScript Sandbox", path: "/js-sandbox" },
  { name: "Escape/Unescape Newlines", path: "/escape-newlines" },
] as const;

export const testData = {
  validJson: `{
  "name": "Test User",
  "age": 25,
  "active": true
}`,

  invalidJson: `{
  "name": "Test User",
  "age": 25
  missing: comma
}`,

  validYaml: `name: Test User
age: 25
active: true`,

  invalidYaml: `name: Test User
  age: [25
  broken`,

  validCsv: `name,age,city
John,30,New York
Jane,25,Los Angeles`,

  validJsonArray: `[
  {"name": "John", "age": 30},
  {"name": "Jane", "age": 25}
]`,

  urlToEncode: "Hello World! How are you?",
  encodedUrl: "Hello%20World!%20How%20are%20you%3F",

  markdownSample: `# Hello World

This is a **bold** text and *italic* text.

- Item 1
- Item 2`,

  jsSample: `console.log("Hello from sandbox!");
const sum = (a, b) => a + b;
console.log(sum(2, 3));`,

  diffOriginal: `Line 1
Line 2
Line 3`,

  diffModified: `Line 1
Line 2 Modified
Line 3
Line 4`,

  textToEscape: `Hello World!
This is a multi-line string.
It has three distinct lines.`,

  escapedText: `Hello World!\\nThis is a multi-line string.\\nIt has three distinct lines.`,
};
