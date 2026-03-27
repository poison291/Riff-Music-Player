use lofty::{AudioFile, Probe, TaggedFileExt};
use walkdir::WalkDir;
use base64::{engine::general_purpose, Engine as _};

use crate::models::Song;

pub fn scan_music_folder(path: &str) -> Vec<Song> {
    let mut songs = Vec::new();
    let mut id = 1;

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        let file_path = entry.path();

        if file_path.is_file() {
            if let Some(ext) = file_path.extension().and_then(|e| e.to_str()) {
                let ext = ext.to_lowercase();

                if ["mp3", "flac", "wav", "ogg"].contains(&ext.as_str()) {
                    if let Ok(tagged_file) = Probe::open(file_path).and_then(|p| p.read()) {

                        let tag = tagged_file.primary_tag();

                        let title = tag
                            .and_then(|t: &lofty::Tag| t.get_string(&lofty::ItemKey::TrackTitle))
                            .unwrap_or("Unknown")
                            .to_string();

                        let artist = tag
                            .and_then(|t: &lofty::Tag| t.get_string(&lofty::ItemKey::TrackArtist))
                            .unwrap_or("Unknown")
                            .to_string();

                        let image = tag.and_then(|t: &lofty::Tag| {
                            t.pictures().first().map(|pic| {
                                let base64 = base64::engine::general_purpose::STANDARD.encode(&pic.data());
                        
                                let mime = pic.mime_type()
                                    .map(|m| m.to_string())
                                    .unwrap_or_else(|| "image/png".to_string());
                        
                                format!("data:{};base64,{}", mime, base64)
                            })
                        });

                        songs.push(Song {
                            id,
                            title,
                            artist,
                            path: file_path.to_string_lossy().to_string(),
                            image,
                        });

                        id += 1;
                    }
                }
            }
        }
    }

    songs
}