# OpenDevTools

Free, open-source developer tools. All processing happens in your browser.

## Features

- **100% Client-Side**: Your data never leaves your browser
- **No Tracking**: No analytics, no cookies (except for UI preferences)
- **No Login Required**: Just open and use
- **Dark Mode**: Toggle between light and dark themes
- **Open Source**: MIT licensed

## Available Tools

- **JSON to YAML** - Convert JSON data to YAML format
- **YAML to JSON** - Convert YAML data to JSON format
- **JSON Format** - Format and validate JSON data
- **CSV to JSON** - Convert CSV data to JSON format
- **JSON to CSV** - Convert JSON array to CSV format
- **URL Encode/Decode** - Encode or decode URL strings
- **Text Diff** - Compare two text blocks and see differences
- **Lorem Ipsum** - Generate placeholder text
- **Markdown Preview** - Preview markdown with live rendering

## Tech Stack

- [Next.js 15+](https://nextjs.org/) - React framework with App Router
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icon library

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/opendevtools.git
cd opendevtools

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
