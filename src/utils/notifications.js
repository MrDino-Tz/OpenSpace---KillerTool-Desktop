export async function sendNotification(title, body) {
  if (!window.__TAURI__) return;
  try {
    const { sendNotification: tauriNotify, isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification');
    let granted = await isPermissionGranted();
    if (!granted) {
      const permission = await requestPermission();
      granted = permission === 'granted';
    }
    if (granted) {
      tauriNotify({ title, body });
    }
  } catch (e) {
    console.warn('Notification failed:', e);
  }
}
