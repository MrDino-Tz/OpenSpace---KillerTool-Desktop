# OpenSpace — KillerTool Desktop

**Version:** 1.0.0 | **Identifier:** `com.dtc.openspace-killertools-desktop`
**Author:** DTC Team | **Platform:** Linux (deb, AppImage, rpm)

Free, open-source, client-side tool suite. Everything runs locally — no data ever leaves your machine.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation & Build](#installation--build)
- [Layout & Navigation](#layout--navigation)
- [Tools Reference](#tools-reference)
  - [Dashboard](#1-dashboard)
  - [Text Tools](#2-text-tools)
  - [Conversion Tools](#3-conversion-tools)
  - [CryptOK](#4-cryptok)
  - [Media Tools](#5-media-tools)
  - [Document Tools](#6-document-tools)
- [Desktop Features](#desktop-features)
- [Architecture](#architecture)
- [Development](#development)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 |
| Build Tool | Vite 6.0.11 |
| Language | JavaScript (JSX) |
| UI Library | MUI (Material-UI) 6.4.1 |
| Icons | @ant-design/icons 5.6.0 |
| Routing | react-router-dom 7.1.3 |
| Desktop Shell | Tauri v2 (Rust backend) |
| Desktop APIs | plugin-dialog, plugin-fs |
| CSS-in-JS | @emotion/react 11.14 |
| Animations | framer-motion 10.18 |
| Font Sources | Inter, Poppins, Public Sans, Roboto |
| Key Libraries | pdf-lib, pdfjs-dist, node-forge, colord, dompurify, marked, figlet, zxcvbn, qrcode.react |

---

## Installation & Build

### Prerequisites
- Rust toolchain (rustc + cargo)
- WebKitGTK development libraries
- Node.js 18+ and npm

### Development
```bash
cd "OpenSpace - KillerTool Desktop"
npm install
npm run start          # Vite dev server at http://localhost:3000
npx tauri dev          # Hot-reload in Tauri window
```

### Production Build
```bash
npx tauri build
```

Output:
- `src-tauri/target/release/bundle/deb/OpenSpace KillerTool_1.0.0_amd64.deb`
- `src-tauri/target/release/bundle/appimage/OpenSpace KillerTool_1.0.0_amd64.AppImage`
- `src-tauri/target/release/bundle/rpm/OpenSpace KillerTool-1.0.0-1.x86_64.rpm`

Install the .deb:
```bash
sudo dpkg -i "OpenSpace KillerTool_1.0.0_amd64.deb"
```

---

## Layout & Navigation

```
┌──────────────────────────────────────────────────────┐
│  HEADER                                              │
│  [☰] [Search Ctrl+K] [GitHub] [🌙/☀️] [About]       │
├──────────┬───────────────────────────────────────────┤
│ DRAWER   │  MAIN CONTENT                             │
│ 260px    │                                           │
│          │  • Breadcrumbs                            │
│ [Logo]   │  • Tool page (Outlet)                     │
│          │  • Footer                                 │
│ Collapse │                                           │
│  Groups: │                                           │
│  ▶ Text  │                                           │
│    Tools │                                           │
│    ● ASC │                                           │
│    ● Emo │                                           │
│  ▶ Conv  │                                           │
│    ...   │                                           │
└──────────┴───────────────────────────────────────────┘
```

- **Header:** Fixed AppBar with hamburger menu toggle, search (Ctrl+K), GitHub repo link, theme toggle (light/dark with animated transition), About dialog.
- **Sidebar:** Collapsible category groups. Click a group title to expand/collapse (starts collapsed). Mini variant at 60px when closed, full 260px when open.
- **Search (Ctrl+K):** Modal dialog that filters all 12 tools by name, description, or category. Results grouped by expandable category accordions. Auto-expands matching categories.
- **Breadcrumbs:** Auto-generated from the route tree.

---

## Tools Reference

### 1. Dashboard

**Route:** `/` or `/dashboard/default`

Landing page showing:
- App logo, name, and description
- **Stats cards:** Total Tools (12), 100% Client-Side Processing, 6 Categories
- **Tools grid:** All 12 tools as clickable cards, sorted by category with color-coded category chips

---

### 2. Text Tools

#### ASCII Word Art Generator
**Route:** `/tools/text/ascii-generator`

Generate ASCII art banners from text input.

**Features:**
- 60+ figlet fonts loaded on demand
- Font selector with quick-preset chips (Standard, Big, Doom, Slant, Star Wars)
- Text input (100 char max) with multi-line support
- Preview font size slider (8–20px)
- Art color picker with 10 presets + custom color
- Copy to clipboard, Download as .txt
- Auto-generate with 400ms debounce
- Stats: font name, line count, character count, width

#### Emoji Picker
**Route:** `/tools/text/emoji-picker`

Browse, search, and copy 1800+ emoji from Apple's emoji dataset.

**Features:**
- 1800+ emoji grouped by 10 categories (All, Smileys, People, Animals, Food, Travel, Activities, Objects, Symbols, Flags)
- Search bar with clear button
- Emoji size selector: S (24px), M (32px), L (40px)
- Click to copy instantly
- Details panel: large preview, name, shortcode, category, Unicode
- Recently Used section (last 30)
- Copied collection with badge count, copy-all, clear

---

### 3. Conversion Tools

#### Text to ASCII Binary
**Route:** `/tools/conversion/text-to-binary`

Encode/decode text between Binary, Octal, Decimal, and Hexadecimal.

**Features:**
- 4 modes: Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16)
- Direction toggle: Text → Code / Code → Text
- Separator options: Space, Newline, Comma, Pipe, None
- Swap button to exchange input/output
- Copy, Download as .txt, Clear
- Quick Reference table
- Real-time conversion on every keystroke

#### Markdown to HTML
**Route:** `/tools/conversion/markdown-to-html`

Live Markdown editor with preview and HTML export.

**Features:**
- GFM Markdown parsing (marked library)
- DOMPurify HTML sanitization toggle
- 3 view modes: Split, Preview, Raw HTML
- Sample markdown loader
- Copy HTML, Copy Markdown, Download as .html/.md
- Expandable Markdown syntax reference (8 sections with copy buttons)
- Stats: lines, words, chars, HTML bytes

#### Color Converter
**Route:** `/tools/conversion/color-converter`

Convert between 7 color formats with real-time preview.

**Features:**
- Uses colord library with plugins: names, cmyk, hwb, a11y
- 7 format fields with copy buttons: HEX, RGB, HSL, HSV, HWB, CMYK, CSS Name
- Large color preview showing hex value and CSS name
- Native color picker
- Color analysis: Brightness, Luminance, Contrast on white/black
- Variations: 20% lighter / base / 20% darker swatches
- Edit any field for live cross-format updates

#### Currency Converter
**Route:** `/tools/conversion/currency-converter`

Real-time exchange rates for 160+ currencies.

**Features:**
- Rates from open.er-api.com (free, no API key, updates every 10 minutes)
- 160+ currencies with full country names
- Two autocomplete dropdowns with search
- Swap currencies button
- Popular pair chips (USD/EUR, USD/TZS, USD/KES, etc.)
- Large result display with rate info
- Copy Result, Copy Rate, inverse rate display
- Last updated timestamp

---

### 4. CryptOK

#### Password Generator
**Route:** `/tools/crypto/password-generator`

Cryptographically-secure password/passphrase/UUID generator.

**Features:**
- Uses `window.crypto.getRandomValues()` (secure)
- 10 presets: Custom, Local Admin, Service Account, Wi-Fi PSK, PIN, API Key (hex), UUID v4, Passphrase 4/6 words, Pronounceable
- Character options: uppercase, lowercase, numbers, symbols
- Length slider: 4–128 characters
- Strength meter with LinearProgress bar
- QR Code generation (via qrcode.react) with SVG download
- History panel (last 10 passwords)
- Copy, Generate, Clear

#### Password Analyzer
**Route:** `/tools/crypto/password-analyzer`

Local password strength analysis using Dropbox's zxcvbn algorithm.

**Features:**
- Real-time analysis as you type
- Score 0–4 with color-coded progress bar (Very Weak → Strong)
- Crack time estimates: brute force (10B/s), online (10/s), bcrypt (10K/s)
- Feedback & suggestions panel with improvement tips
- Pattern analysis chips (dictionary, repeat, sequence, etc.)
- All processing is local — zero network requests

#### PDF Signature Checker
**Route:** `/tools/crypto/pdf-signature-checker`

Client-side PKCS#7 digital signature validation.

**Features:**
- Upload PDF via native dialog or drag-and-drop
- Parses DER/ASN.1 embedded certificates (node-forge)
- Signer subject details: CN, O, OU, Email, Country
- Issuer/CA details
- Certificate validity dates with VALID/EXPIRED status chip
- Serial number display
- All processing local — file never uploaded

---

### 5. Media Tools

#### Image Resizer
**Route:** `/tools/media/image-resizer**

Resize, crop, and convert images interactively.

**Features:**
- Upload via native dialog or drag-and-drop
- Supports PNG, JPEG, WEBP, GIF, BMP, SVG
- Interactive crop box with 8 drag handles
- Dark overlay outside crop area
- Output dimensions: Width/Height inputs with swap button
- Format selector: PNG, JPEG, WEBP
- Quality slider (10–100%) for lossy formats
- Rotation: 0°/90°/180°/270° presets + incremental
- Live canvas preview of result
- Download via native save dialog (fallback to browser download)
- Copy to clipboard

#### Photo Editor
**Route:** `/tools/media/photo-editor`

Full-featured canvas-based photo editor.

**Features:**
- Upload via native dialog or drag-and-drop
- **Tools:**
  - Add Text — drag onto canvas, edit content, font (28 options), size, bold, color
  - Add Image Overlay — upload images, drag to position, resize
  - Paint — freehand drawing with brush size/color
  - Pixel Eraser — erase or recolor pixels, adjustable size
  - Color Picker — sample pixel colors from canvas
- Elements panel: list all placed elements, select/rename/edit/delete
- Undo Last, Clear All
- Download at full resolution via native save dialog
- HiDPI display support via devicePixelRatio

---

### 6. Document Tools

#### PDF Editor
**Route:** `/tools/document/pdf-editor`

Edit PDF documents — modify text, add shapes, images, notes, merge, and split.

**Features:**
- **Upload** via native dialog, drag-and-drop, or "Replace" button
- **Page navigation:** thumbnail sidebar with scroll-into-view, prev/next arrows, active page highlight
- **Add blank page** / **Delete current page**
- **Zoom levels:** 50%–200%
- **Auto-Detect** — scans PDF for text items, form fields (orange dashed), images (blue dashed)
- **Toolbar:**
  - Select/Move — click to select elements
  - Edit Text — double-click detected text to edit inline (textarea); Enter saves, Escape cancels
  - Add Text — click to place new text annotation
  - Add Image — upload and place images on pages
  - Draw Shape — drag to draw Rectangle, Circle, or Line (fill/stroke/width controls)
  - Add Note — place yellow sticky-pin notes
- **Text styles:** Font (Helvetica/Times Roman/Courier), Size, Bold, Italic, Color
- **Shape styles:** Fill color, Stroke color, Stroke width
- **Merge PDF:** select another PDF, all pages appended, auto-downloads merged file
- **Split PDF:** enter page ranges (e.g., `1-3, 5, 7-9`), extracts pages to new file
- **Download:** all modifications rendered (white-out + redraw for edited text, embedded images, shapes, notes)
- Uses pdf-lib for PDF manipulation and pdfjs-dist for rendering

---

## Desktop Features

### Native File Dialogs
All file operations use Tauri's native dialog and filesystem plugins:

| Component | Operation | Native API |
|---|---|---|
| PDF Editor | Open PDF, Add Image, Merge | `pickAndReadFile()` |
| Photo Editor | Open photo, Add overlay | `pickAndReadFile()` |
| Image Resizer | Open image | `pickAndReadFile()` |
| PDF Signature Checker | Open PDF | `pickAndReadFile()` |
| All downloads | Save file | `saveAndWriteFile()` |

When not running in Tauri (e.g., during dev), all operations fall back to browser `<input>` / Blob download APIs.

### Splash Screen
On launch, shows the app logo with "OpenSpace KillerTool" text and a loading spinner on a transparent background. Fades out after 1.5 seconds.

### Window
- Default size: 1280×800, centered
- Min size: 800×600
- Content Security Policy restricts to `self`, `data:`, `blob:` sources

### Offline
All processing is fully client-side. The app works offline once installed — no network requests except for currency exchange rates (open.er-api.com) and font downloads (first load only).

---

## Architecture

### Source Map
```
src/
├── components/          # Shared components
│   ├── logo/            # LogoMain, LogoIcon
│   ├── SplashScreen.jsx # Desktop splash overlay
│   └── ...              # MainCard, Loader, Loadable, ScrollTop, etc.
├── contexts/            # ThemeContext (light/dark mode)
├── data/
│   └── tools.js         # Single source of truth for all 12 tools
├── layout/
│   └── Dashboard/
│       ├── Header/      # AppBar, Search, About, theme toggle
│       ├── Drawer/      # Sidebar with collapsible NavGroups
│       └── Footer.jsx
├── menu-items/          # Sidebar structure (7 groups)
│   ├── index.jsx
│   ├── textTools.jsx
│   ├── conversionTools.jsx
│   ├── cryptoTools.jsx
│   ├── mediaTools.jsx
│   ├── currencyTools.jsx
│   └── documentTools.jsx
├── pages/
│   ├── dashboard/       # Default dashboard page
│   └── tools/
│       ├── text/        # ASCII generator, Emoji picker
│       ├── conversion/  # Binary, Markdown, Color, Currency
│       ├── crypto/      # Password gen, Password analyzer, PDF sig
│       ├── media/       # Image resizer, Photo editor
│       └── document/    # PDF editor
├── routes/              # MainRoutes.jsx (lazy-loaded routes)
├── themes/              # MUI theme customization
├── utils/
│   └── fileIO.js        # Tauri native dialog abstraction
└── App.jsx              # Root with SplashScreen + RouterProvider
```

### State Management
- No global state library (no Redux/Zustand).
- **SWR** used minimally for drawer open/close state.
- **React Context** for theme (light/dark) with localStorage persistence.
- Each tool manages its own local state via `useState`/`useRef`/`useCallback`.

### Routing
- react-router-dom v7 with `createBrowserRouter`.
- All tool pages are lazy-loaded (`React.lazy`) with Suspense fallback.

---

## Development

### Adding a New Tool
1. Create the page component in `src/pages/tools/<category>/`.
2. Add the menu entry in `src/menu-items/<category>.jsx`.
3. Add the route in `src/routes/MainRoutes.jsx`.
4. Add the tool entry in `src/data/tools.js` (used by Search + Dashboard).
5. Test with `npm run start` then `npx tauri dev`.

### Linting
```bash
npm run lint
npm run lint:fix
npm run prettier
```

### Build Distribution
```bash
npx tauri build
```
Produces `.deb`, `.AppImage`, and `.rpm` in `src-tauri/target/release/bundle/`.

### Notes
- `src/data/tools.js` must stay in sync with `src/menu-items/` — both maintained manually.
- The PDF.js worker is bundled locally (no CDN) via Vite's `?url` import.
- Drawing shapes in the PDF Editor uses window-level `mousemove`/`mouseup` listeners.
- Currency rates auto-refresh every 10 minutes from `open.er-api.com`.
