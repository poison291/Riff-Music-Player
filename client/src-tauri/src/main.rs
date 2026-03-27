#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod music;
mod models;

use commands::get_songs;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_songs])
        .run(tauri::generate_context!())
        .expect("error while running app");
}