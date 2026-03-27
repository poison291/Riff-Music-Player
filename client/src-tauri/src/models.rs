use serde::{Serialize, Deserialize};  // add Deserialize here

#[derive(Serialize, Deserialize)]
pub struct Song {
    pub id: usize,
    pub title: String,
    pub artist: String,
    pub path: String,
    pub image: Option<String>,
}