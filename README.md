# OpenDevTools

Free, open-source developer tools. All processing happens in your browser.

## Features

- **100% Client-Side**: Your data never leaves your browser
- **No Tracking**: No analytics, no cookies (except for UI preferences)
- **No Login Required**: Just open and use
- **Dark Mode**: Toggle between light and dark themes
- **Command Bar**: Press `Cmd+K` (or `Ctrl+K`) to quickly search and navigate to any tool
- **Favorites**: Bookmark your most-used tools for quick access in the sidebar
- **State Persistence**: Your input and settings are saved locally, so you can pick up where you left off
- **Open Source**: MIT licensed

## Available Tools

- [**JSON to YAML**](https://opendevtools.io/json-to-yaml) - Convert JSON data to YAML format
- [**YAML to JSON**](https://opendevtools.io/yaml-to-json) - Convert YAML data to JSON format
- [**JSON Format**](https://opendevtools.io/json-format) - Format and validate JSON data
- [**CSV to JSON**](https://opendevtools.io/csv-to-json) - Convert CSV data to JSON format
- [**JSON to CSV**](https://opendevtools.io/json-to-csv) - Convert JSON array to CSV format
- [**URL Encode/Decode**](https://opendevtools.io/url-encode-decode) - Encode or decode URL strings
- [**Text Diff Checker**](https://opendevtools.io/text-diff) - Compare two text blocks and see differences
- [**Lorem Ipsum**](https://opendevtools.io/lorem-ipsum) - Generate placeholder text
- [**Markdown Preview**](https://opendevtools.io/markdown-preview) - Preview markdown with live rendering

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
git clone https://github.com/vigneshrajsb/opendevtools.io.git
cd opendevtools.io

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

## Credits

OpenDevTools is built on the shoulders of giants. We're grateful to the open source community and the maintainers who make projects like this possible.

### Core Technologies
- [Next.js](https://github.com/vercel/next.js) - The React framework
- [React](https://github.com/facebook/react) - UI library
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - Utility-first CSS
- [shadcn/ui](https://github.com/shadcn-ui/ui) - Beautiful UI components
- [Lucide](https://github.com/lucide-icons/lucide) - Icon library

### Libraries We Love
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [cmdk](https://github.com/pacocoursey/cmdk) - Command menu
- [dnd-kit](https://github.com/clauderic/dnd-kit) - Drag and drop
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parsing
- [lorem-ipsum](https://github.com/knicklabs/lorem-ipsum.js) - Text generation
- [diff](https://github.com/kpdecker/jsdiff) - Text diffing

### Support Open Source

Open source software powers the modern web. If you find these tools useful, consider giving back:

- **Star** the repositories of projects you use
- **Sponsor** maintainers on [GitHub Sponsors](https://github.com/sponsors)
- **Contribute** bug reports, documentation, or code
- **Share** open source projects with your network

Every contribution, no matter how small, helps keep the open source ecosystem thriving.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
