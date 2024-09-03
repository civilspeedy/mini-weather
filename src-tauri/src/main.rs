#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.set_fullscreen(true).unwrap();
            window.set_cursor_grab(true).unwrap();
            window.set_cursor_visible(false).unwrap(); // doesn't really work
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
