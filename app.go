package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/dhowden/tag"
)

// App struct
type App struct {
	ctx context.Context
}
type Song struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Path     string `json:"path"`
	Ext      string `json:"ext"`
	Image    string `json:"image"`
	Duration int    `json:"duration"`
	StreamURL string `json:"streamUrl"`
}


func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	home, _ := os.UserHomeDir()
	musicDir  := filepath.Join(home, "music")
	fs := http.FileServer(http.Dir(musicDir))
	go http.ListenAndServe(":9876", fs)
}
func (a *App) GetSongs() []Song {
	home, _ := os.UserHomeDir()
	dirName := filepath.Join(home, "music")

	files, err := os.ReadDir(dirName)
	if err != nil {
		fmt.Println("Error reading music directory")
		return nil
	}
	var songs []Song
	sn := 1
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		ext := strings.ToLower(filepath.Ext(file.Name()))
		if ext == ".mp3" || ext == ".wav" || ext == ".flac" {
			fullPath := filepath.Join(dirName, file.Name())
			f, err := os.Open(fullPath)
			if err != nil {
				continue
			}
			meta, err := tag.ReadFrom(f)
			f.Close()
			title := file.Name()
			artist := ""
			album := ""
			if meta != nil {
				if meta.Title() != "" {
					title = meta.Title()
				}
				artist = meta.Artist()
				album = meta.Album()
			}
			image := ""
			if meta != nil {
				if pic := meta.Picture(); pic != nil {
					encoded := base64.StdEncoding.EncodeToString(pic.Data)
					image = "data:" + pic.MIMEType + ";base64," + encoded
				}
			}

			songs = append(songs, Song{
				ID:        sn,
				Title:     title,
				Path:      fullPath,
				Album:     album,
				Artist:    artist,
				Ext:       ext,
				Image:     image,
				StreamURL: "http://localhost:9876/" + url.PathEscape(file.Name()),
			})
			sn++
		}
	}
	return songs
}
