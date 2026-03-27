package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"github.com/dhowden/tag"
)

type Song struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	Album  string `json:"album"`
	Path   string `json:"path"`
	Image  string `json:"image"`
	Ext string `json:"ext"`
}

func getSong() []Song{
	home, _ := os.UserHomeDir()
	DirName := home + "/music"
	files, err := os.ReadDir(DirName)

	if err != nil {
		fmt.Println("Error in Reading Music Directory")
	}
	var songs []Song
	sn := 1
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		ext := strings.ToLower(filepath.Ext(file.Name()))
		if ext == ".mp3" || ext == ".wav" || ext == ".flac" {

			fullPath := filepath.Join(DirName, file.Name())
			f, err := os.Open(fullPath)
			if err != nil {
				continue
			}

			meta, err := tag.ReadFrom(f)
			f.Close()

			songs = append(songs, Song{
				ID:    sn,
				Title: file.Name(),
				Path:  fullPath,
				Album: meta.Album(),
				Artist: meta.Artist(),
				Ext:   ext,
			})
			sn++

		
		}
	}
	return songs
}

func main() {
	songs := getSong()
	data, _ := json.Marshal(songs)
	fmt.Println(string(data))
}
