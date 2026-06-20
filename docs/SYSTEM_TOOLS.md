# ⚡ System Tools — OpenSpace KillerTool Desktop

**Status:** Planned — Desktop Edition v1.1.0
**Author:** DTC Team
**Platform:** Desktop-only (Tauri v2)

> These tools use native OS APIs exposed via Tauri and are **not available** in the browser/web edition of OpenSpace KillerTools.

---

## Table of Contents

- [Overview](#overview)
- [Clipboard Manager](#clipboard-manager)
- [Screenshot](#screenshot)
- [Screen Recorder](#screen-recorder)
- [Implementation Guide](#implementation-guide)

---

## Overview

| Tool | Route | Shortcut | Status |
|---|---|---|---|
| Clipboard Manager | `/tools/system/clipboard` | `Ctrl+Shift+V` | Planned |
| Screenshot | `/tools/system/screenshot` | — | Planned |
| Screen Recorder | `/tools/system/screen-recorder` | `Ctrl+Shift+R` | Planned |

**New Tauri plugins required:**
- `@tauri-apps/plugin-clipboard-manager`
- `@tauri-apps/plugin-store`
- `@tauri-apps/plugin-global-shortcut`
- `xcap` Rust crate (for screenshot capture)

---

## Clipboard Manager

**Route:** `/tools/system/clipboard`
**File:** `src/pages/tools/system/ClipboardManager.jsx`

A full-featured clipboard history manager that captures and organises everything you copy.

### Features

- Automatic clipboard monitoring using Tauri's `clipboard-manager` plugin
- Persistent clipboard history — last 100 entries with timestamps
- Entry types: plain text, rich text, file paths, and image previews
- Search/filter bar to quickly find past copies
- One-click re-copy of any history entry
- Pin important entries to prevent them from rolling off the history
- Delete individual entries or clear all history at once
- **Privacy mode toggle** — pauses capture without closing the app
- Keyboard shortcut `Ctrl+Shift+V` to open/focus the tool
- Arrow key navigation through history entries
- All data stored locally via Tauri's `plugin-store` — never transmitted

### Tauri APIs

| API | Purpose |
|---|---|
| `@tauri-apps/plugin-clipboard-manager` | Read and write clipboard content |
| `@tauri-apps/plugin-store` | Persist clipboard history to disk |
| `@tauri-apps/plugin-global-shortcut` | Register `Ctrl+Shift+V` system-wide |

### Notes

- Clipboard polling interval: 500ms (configurable)
- Images stored as base64 data URIs in the local store
- History file location: `$APP_DATA/clipboard-history.json`

---

## Screenshot

**Route:** `/tools/system/screenshot`
**File:** `src/pages/tools/system/Screenshot.jsx`

Capture the full screen, a window, or a selected region — then annotate and save.

### Capture Modes

| Mode | Description |
|---|---|
| Full Screen | Captures the entire display |
| Window Capture | Select any open application window from a dropdown |
| Region Select | Drag a crosshair selection rectangle over any area |

### Features

- **Countdown timer:** 0 / 3 / 5 seconds before capture — useful for capturing open menus
- **Annotation toolbar** (applied over the captured image):
  - Rectangle, Circle, Arrow — draw shapes
  - Freehand pen — adjustable brush size and color
  - Text annotation — click to place, type, and style
  - Blur tool — pixelate sensitive regions
  - Crop — trim the final image
- **Format selector:** PNG, JPEG, WEBP
- **Quality slider** for lossy formats (10–100%)
- Save via native save dialog or copy directly to clipboard
- Preview pane with zoom (50–200%)
- Session history of recent screenshots with thumbnails

### Tauri APIs

| API | Purpose |
|---|---|
| `xcap` Rust crate (via `tauri::command`) | Capture screen, window, or region |
| `@tauri-apps/plugin-dialog` | Native save dialog |
| `@tauri-apps/plugin-fs` | Write image file to disk |
| `@tauri-apps/plugin-clipboard-manager` | Copy screenshot to clipboard |

### Notes

- Screen capture is handled on the Rust side using the `xcap` crate
- The Tauri command returns raw bytes (PNG) which are rendered on a `<canvas>` in the frontend
- Annotation is done entirely client-side on the canvas before saving

---

## Screen Recorder

**Route:** `/tools/system/screen-recorder`
**File:** `src/pages/tools/system/ScreenRecorder.jsx`

Record the screen or a window with optional audio and export to video.

### Source Options

| Source | Description |
|---|---|
| Full Screen | Records the entire display |
| Specific Window | Select a single application window |
| Browser Tab | Captures a specific tab (via WebView) |

### Audio Options

- System audio capture (where supported by OS)
- Microphone input with device selector dropdown
- Mute / unmute toggle during live recording

### Recording Controls

| Control | Description |
|---|---|
| Start | Begin recording |
| Pause / Resume | Pause without stopping |
| Stop | End recording and enter preview |
| Live Timer | HH:MM:SS display during recording |
| Preview Thumbnail | Small live preview in the toolbar |

### Output Settings

| Setting | Options |
|---|---|
| Format | WebM (VP9), MP4 (H.264) |
| Quality | Low / Medium / High / Lossless |
| Frame Rate | 15 / 30 / 60 fps |

### Post-Recording

- Inline preview of the recording before saving
- Trim start/end with a range slider
- Save via native dialog or copy the file path to clipboard
- Discard and record again

### Keyboard Shortcut

- `Ctrl+Shift+R` — start/stop recording globally

### Tauri APIs

| API | Purpose |
|---|---|
| Web `MediaDevices.getDisplayMedia()` | Capture display stream (handled by Tauri WebView) |
| Web `MediaRecorder` | Encode and buffer the video stream |
| `@tauri-apps/plugin-dialog` | Native save dialog |
| `@tauri-apps/plugin-fs` | Write video file to disk |
| `@tauri-apps/plugin-global-shortcut` | Register `Ctrl+Shift+R` system-wide |

### Notes

> **Linux platform note:** Screen recording and microphone/system audio capture may require additional permissions depending on the desktop environment:
> - **PipeWire** (modern) — typically works with a permission prompt
> - **PulseAudio** (legacy) — may require manual configuration
> - The app will display a clear permission prompt if access is denied

- Recordings are buffered in memory during capture
- Files are written to disk only on explicit user save
- Temporary buffer is cleared on discard

---

## Implementation Guide

### Step 1 — Add Tauri Plugins

Add to `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-clipboard-manager = "2"
tauri-plugin-store = "2"
tauri-plugin-global-shortcut = "2"
xcap = "0.0.14"
```

Register in `src-tauri/src/lib.rs`:
```rust
tauri::Builder::default()
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    // ...
```

Add permissions in `src-tauri/capabilities/default.json`:
```json
{
  "permissions": [
    "clipboard-manager:default",
    "store:default",
    "global-shortcut:default",
    "fs:default",
    "dialog:default"
  ]
}
```

### Step 2 — Create Page Components

```
src/pages/tools/system/
├── ClipboardManager.jsx
├── Screenshot.jsx
└── ScreenRecorder.jsx
```

### Step 3 — Add Menu Items

Create `src/menu-items/systemTools.jsx`:
```jsx
const systemTools = {
  id: 'system-tools',
  title: 'System Tools',
  type: 'group',
  children: [
    {
      id: 'clipboard',
      title: 'Clipboard Manager',
      type: 'item',
      url: '/tools/system/clipboard',
      icon: ContentPasteIcon,
    },
    {
      id: 'screenshot',
      title: 'Screenshot',
      type: 'item',
      url: '/tools/system/screenshot',
      icon: CameraAltIcon,
    },
    {
      id: 'screen-recorder',
      title: 'Screen Recorder',
      type: 'item',
      url: '/tools/system/screen-recorder',
      icon: VideocamIcon,
    },
  ],
};
export default systemTools;
```

### Step 4 — Register Routes

In `src/routes/MainRoutes.jsx`, add lazy imports and routes:
```jsx
const ClipboardManager = lazy(() => import('pages/tools/system/ClipboardManager'));
const Screenshot       = lazy(() => import('pages/tools/system/Screenshot'));
const ScreenRecorder   = lazy(() => import('pages/tools/system/ScreenRecorder'));

// inside children:
{ path: 'tools/system/clipboard',       element: <ClipboardManager /> },
{ path: 'tools/system/screenshot',      element: <Screenshot /> },
{ path: 'tools/system/screen-recorder', element: <ScreenRecorder /> },
```

### Step 5 — Add to tools.js

In `src/data/tools.js`, add 3 new entries with `category: 'System Tools'`.

### Step 6 — Test

```bash
npx tauri dev
```

---

*DTC Team © 2026 — OpenSpace KillerTool Desktop*
