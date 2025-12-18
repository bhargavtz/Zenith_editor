# Zenith Editor ✨

> **Zero Friction, Maximum Power** - A modern, feature-rich markdown editor built with React and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## ✨ Features

### Editor
- 📝 **CodeMirror 6** - Powerful markdown editing with syntax highlighting
- 🎨 **Live Preview** - Real-time rendering with math (KaTeX) and code highlighting
- 🌓 **Themes** - Light, Dark, and Auto modes
- ⌨️ **Vim Mode** - Optional Vim keybindings for power users
- 💾 **Auto-save** - Never lose your work with automatic local storage

### Formatting
- 🎯 **Full Toolbar** - Headings, Bold, Italic, Links, Lists, and more
- 📋 **Table of Contents** - Auto-generated from document headings
- 🔢 **Math Equations** - KaTeX support for mathematical notation
- 💻 **Code Blocks** - Syntax highlighting for 100+ languages

### Export
- 📄 **Professional PDFs** - 5 beautiful templates (Academic, Business, Technical, Resume, Article)
- 🌐 **HTML Export** - Standalone web files with styling
- 📝 **DOCX Export** - Microsoft Word compatible documents
- ⬇️ **Markdown Export** - Raw source files

### Templates
- 🎓 **Resume** - Professional CV template
- 📊 **Business Report** - Executive summary format
- 💻 **Technical Docs** - API documentation format
- ✍️ **Blog Article** - SEO-optimized content structure
- 📝 **Meeting Notes** - Structured agenda and action items

### AI-Powered
- 🤖 **Slash Commands** - `/improve`, `/summarize`, `/fix`, and more
- ✨ **Smart Suggestions** - AI-assisted writing (OpenRouter integration)

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zenith-editor.git
cd zenith-editor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Basic Editing
1. Start typing markdown in the editor
2. See live preview in real-time
3. Use toolbar for quick formatting
4. Auto-save keeps your work safe

### Using Templates
1. Click **"New from Template"** in toolbar
2. Browse the template gallery
3. Select a template to start
4. Customize and save!

### Exporting Documents
1. Click the **Download** icon
2. Choose format (PDF, HTML, DOCX, MD)
3. Select a template (for PDF/HTML)
4. Add title and author
5. Click **Export**

### AI Features
1. Type `/` to see available commands
2. Select a command (e.g., `/improve`)
3. AI processes your selection
4. Review and accept changes

## 🛠️ Tech Stack

- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Editor**: CodeMirror 6
- **Markdown**: unified, remark, rehype
- **Storage**: Dexie (IndexedDB)
- **AI**: OpenRouter API
- **Styling**: TailwindCSS 3.4
- **Animations**: Framer Motion
- **Exports**: jsPDF, html2canvas, docx

## 📁 Project Structure

```
zenith-editor/
├── src/
│   ├── components/
│   │   ├── editor/          # Editor, Toolbar, Preview
│   │   ├── export/          # Export dialog
│   │   └── templates/       # Template gallery
│   ├── lib/
│   │   ├── export/          # Export engines
│   │   ├── templates/       # Document templates
│   │   ├── ai/             # AI integration
│   │   └── storage/        # Database
│   ├── stores/             # Zustand state management
│   └── styles/             # Global styles
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🔑 Environment Variables

Create a `.env` file from `.env.example`:

```bash
# OpenRouter AI (optional)
VITE_OPENROUTER_API_KEY=your_key_here
VITE_AI_MODEL=openai/gpt-4o-mini
VITE_AI_MAX_TOKENS=2000

# Supabase (future feature)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CodeMirror](https://codemirror.net/) - Extensible code editor
- [unified](https://unifiedjs.com/) - Markdown processing
- [Lucide](https://lucide.dev/) - Beautiful icons
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS

## 🗺️ Roadmap

- [ ] Cloud sync with Supabase
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Mobile app
- [ ] Custom template creator
- [ ] Export presets
- [ ] Batch operations

## 📞 Support

- 📧 Email: bhargav05@yandex.com
- 🐛 Issues: [GitHub Issues](https://github.com/bhargav05/zenith_editor/issues)

---

Made with ❤️ by the Zenith Team
