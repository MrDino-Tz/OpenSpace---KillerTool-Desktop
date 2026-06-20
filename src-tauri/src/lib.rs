use tauri::{Emitter, Manager};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};

#[tauri::command]
fn close_app(app: tauri::AppHandle) {
    app.exit(0);
}

fn build_menu(app: &tauri::AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    let file = Submenu::with_items(app, "File", true, &[
        &MenuItem::with_id(app, "open", "Open\u{2026}", true, Some("CmdOrCtrl+O"))?,
        &MenuItem::with_id(app, "save", "Save", true, Some("CmdOrCtrl+S"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::quit(app, Some("Quit"))?,
    ])?;

    let edit = Submenu::with_items(app, "Edit", true, &[
        &PredefinedMenuItem::undo(app, Some("Undo"))?,
        &PredefinedMenuItem::redo(app, Some("Redo"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::cut(app, Some("Cut"))?,
        &PredefinedMenuItem::copy(app, Some("Copy"))?,
        &PredefinedMenuItem::paste(app, Some("Paste"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::select_all(app, Some("Select All"))?,
    ])?;

    let view = build_view_menu(app)?;

    let help = Submenu::with_items(app, "Help", true, &[
        &MenuItem::with_id(app, "about", "About OpenSpace KillerTool", true, None::<&str>)?,
    ])?;

    Menu::with_items(app, &[&file, &edit, &view, &help])
}

fn build_view_menu(app: &tauri::AppHandle) -> Result<Submenu<tauri::Wry>, tauri::Error> {
    #[cfg(debug_assertions)]
    {
        Submenu::with_items(app, "View", true, &[
            &MenuItem::with_id(app, "devtools", "Toggle DevTools", true, Some("F12"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::fullscreen(app, Some("Fullscreen"))?,
        ])
    }
    #[cfg(not(debug_assertions))]
    {
        Submenu::with_items(app, "View", true, &[
            &PredefinedMenuItem::fullscreen(app, Some("Fullscreen"))?,
        ])
    }
}

fn create_main_window(app: &tauri::AppHandle) -> Result<(), tauri::Error> {
    let main = tauri::WebviewWindowBuilder::new(
        app,
        "main",
        tauri::WebviewUrl::App("index.html".into()),
    )
    .title("OpenSpace KillerTool")
    .inner_size(1280.0, 800.0)
    .min_inner_size(800.0, 600.0)
    .center()
    .build()?;

    let menu = build_menu(app)?;
    main.set_menu(menu)?;

    app.on_menu_event(|app, event| {
        let id = event.id().as_ref();
        match id {
            "open" | "save" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit(&format!("menu-{}", id), ());
                }
            }
            "about" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit("menu-about", ());
                }
            }
            "devtools" => {
                // open_devtools only available in debug mode via `cargo tauri dev`
            }
            _ => {}
        }
    });

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
        .setup(|app| {
            let _ = create_main_window(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
