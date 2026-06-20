import { open, save, confirm } from '@tauri-apps/plugin-dialog';
import { readFile, writeFile } from '@tauri-apps/plugin-fs';

const isTauri = () => typeof window !== 'undefined' && window.__TAURI__;

export async function pickFile(options = {}) {
  if (isTauri()) {
    const filters = options.filters || [];
    const multiple = options.multiple || false;
    const selected = await open({ multiple, filters });
    return selected;
  }
  return browserPickFile(options);
}

function browserPickFile(options) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (options.accept) input.accept = options.accept;
    if (options.multiple) input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files);
      resolve(options.multiple ? files : files[0]);
    };
    input.click();
  });
}

export async function pickAndReadFile(options = {}) {
  if (isTauri()) {
    const path = await pickFile(options);
    if (!path) return null;
    const data = await readFile(path);
    const name = path.split(/[/\\]/).pop();
    return { data: new Uint8Array(data), path, name };
  }
  const file = await browserPickFile(options);
  if (!file) return null;
  const buffer = await file.arrayBuffer();
  return { data: new Uint8Array(buffer), name: file.name };
}

export async function saveAndWriteFile(defaultName, data, mimeType) {
  if (isTauri()) {
    const ext = defaultName ? defaultName.split('.').pop() : '';
    const filters = ext ? [{ name: defaultName || 'File', extensions: [ext] }] : [];
    const path = await save({ defaultPath: defaultName, filters });
    if (!path) return false;
    await writeFile(path, data);
    return true;
  }
  browserDownloadFile(data, defaultName, mimeType);
  return true;
}

export function browserDownloadFile(data, name, mimeType) {
  const blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function confirmDialog(message, title) {
  if (isTauri()) {
    return confirm(message, { title, kind: 'warning' });
  }
  return window.confirm(message);
}
