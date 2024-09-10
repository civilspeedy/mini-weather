#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{LogicalSize, Manager, State, Window};

const WIDTH: f32 = 800.0;
const HEIGHT: f32 = 480.0;

fn calculate_scale(state: State<'_, Window>) -> f32 {
    let monitor: tauri::Monitor = state.current_monitor().unwrap().unwrap();
    let monitor_size: &tauri::PhysicalSize<u32> = monitor.size();
    let monitor_resolution: f32 = monitor_size.width as f32 * monitor_size.height as f32;
    let window_resolution: f32 = WIDTH * HEIGHT;
    monitor_resolution / window_resolution
}
#[tauri::command]
fn scale(original: f32, state: State<'_, Window>) -> f32 {
    let floater: f32 = calculate_scale(state) as f32;
    original * floater
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window: Window = app.get_window("main").unwrap();
            window.set_size(LogicalSize::new(WIDTH, HEIGHT)).unwrap();
            window.set_cursor_visible(false).unwrap();
            app.manage(window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![scale])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
