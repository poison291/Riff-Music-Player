use crate::models::Song;  // add this
use crate::music::scan_music_folder;
use dirs;

#[tauri::command]
pub fn get_songs() -> Result<Vec<Song>, String> {
    let music_dir = dirs::home_dir()
        .unwrap()
        .join("Music");
    let songs = scan_music_folder(music_dir.to_str().unwrap());
    Ok(songs)
}