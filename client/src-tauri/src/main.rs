#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn get_machine_name() -> String {
    hostname::get().unwrap().to_string_lossy().to_string()
}

#[tauri::command]
fn get_home_dir() -> String {
    dirs::home_dir()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_machine_name, get_home_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}