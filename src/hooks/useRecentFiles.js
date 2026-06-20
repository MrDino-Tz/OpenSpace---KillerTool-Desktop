import { useCallback, useEffect, useState } from 'react';

export default function useRecentFiles(maxItems = 10) {
  const [recentFiles, setRecentFiles] = useState([]);

  const load = useCallback(async () => {
    if (!window.__TAURI__) return;
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('recent-files.json');
      const stored = await store.get('recentFiles');
      if (stored) setRecentFiles(stored);
    } catch (e) {
      console.warn('Failed to load recent files:', e);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addFile = useCallback(async (file) => {
    const entry = { ...file, openedAt: Date.now() };
    if (window.__TAURI__) {
      try {
        const { Store } = await import('@tauri-apps/plugin-store');
        const store = await Store.load('recent-files.json');
        const stored = (await store.get('recentFiles')) || [];
        const updated = [entry, ...stored.filter((f) => f.path !== file.path)].slice(0, maxItems);
        await store.set('recentFiles', updated);
        await store.save();
        setRecentFiles(updated);
        return;
      } catch (e) {
        console.warn('Failed to save recent file:', e);
      }
    }
    setRecentFiles((prev) => [entry, ...prev.filter((f) => f.path !== file.path)].slice(0, maxItems));
  }, [maxItems]);

  const clearFiles = useCallback(async () => {
    if (window.__TAURI__) {
      try {
        const { Store } = await import('@tauri-apps/plugin-store');
        const store = await Store.load('recent-files.json');
        await store.set('recentFiles', []);
        await store.save();
      } catch (e) {
        console.warn('Failed to clear recent files:', e);
      }
    }
    setRecentFiles([]);
  }, []);

  return { recentFiles, addFile, clearFiles };
}
