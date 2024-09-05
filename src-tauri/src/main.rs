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

#[derive(PartialEq)]
struct DateTime {
    day: u16,
    month: u16,
    year: u16,
    hrs: u16,
    mins: u16,
}

fn date_out_of_string(date: &str) -> DateTime {
    let segments: Vec<&str> = date.split(['-', 'T', ':']).collect();
    let mut num_values = Vec::new();

    for index in 0..segments.len() {
        match segments[index].parse::<u16>() {
            Ok(num) => num_values.push(num),
            Err(e) => println!("Err in date_out_of_string: {}", e),
        }
    }

    let date_time: DateTime = DateTime {
        year: num_values[0],
        month: num_values[1],
        day: num_values[2],
        hrs: num_values[3],
        mins: num_values[4],
    };

    date_time
}

fn get_data(date: DateTime, dates: Vec<&str>, date_type: String) {
    for index in 0..dates.len() {
        let being_compared: DateTime = date_out_of_string(dates[index]);
        if date == being_compared {};
    }
}

fn main() {
    date_out_of_string("2024-09-04T00:00");
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
