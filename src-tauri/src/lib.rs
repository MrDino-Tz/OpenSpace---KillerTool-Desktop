use tauri::Manager;

#[tauri::command]
fn close_app(app: tauri::AppHandle) {
    app.exit(0);
}

fn create_main_window(app: &tauri::AppHandle) -> Result<(), tauri::Error> {
    let main = tauri::WebviewWindowBuilder::new(
        app,
        "main",
        tauri::WebviewUrl::App("index.html".into()),
    )
    .title("")
    .inner_size(1280.0, 800.0)
    .min_inner_size(800.0, 600.0)
    .decorations(false)
    .center()
    .build()?;

    let _ = main.show();
    let _ = main.set_focus();

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            let _ = create_main_window(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
