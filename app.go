package main

import (
	"context"
	"embed"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/dhowden/tag"
	"github.com/hugolgst/rich-go/client"
)

//go:embed assets/music/* 
var bundledMusic embed.FS


var bundledNames = map[string]bool{
	"3. Borderline.mp3":                true,
	"4. Let It Happen.mp3":             true,
	"5. WILDFLOWER.mp3":                true,
	"19. Line Without a Hook.mp3":      true,
	"27. Deslocado.mp3":                true,
	"80. Starman - 2012 Remaster.mp3":  true,
	"90. Creep.mp3":                    true,
	"93. Exit Music (For A Film).mp3":  true,
	"94. I Wonder.mp3":                 true,
	"100. Summertime Sadness.mp3":      true,
}

type App struct{ ctx context.Context }

type Song struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Artist    string `json:"artist"`
	Album     string `json:"album"`
	Path      string `json:"path"`
	Ext       string `json:"ext"`
	Image     string `json:"image"`
	Duration  int    `json:"duration"`
	StreamURL string `json:"streamUrl"`
	Bundled   bool   `json:"bundled"`
}

func NewApp() *App { return &App{} }

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	home, _ := os.UserHomeDir()
	musicDir := filepath.Join(home, "music")
	os.MkdirAll(musicDir, os.ModePerm)
	a.copyBundledSongs(musicDir)
	go http.ListenAndServe(":9876", http.FileServer(http.Dir(musicDir)))
	go a.connectDiscord()
}

func (a *App) copyBundledSongs(musicDir string) {
	marker := filepath.Join(musicDir, ".riff_initialized")
	if _, err := os.Stat(marker); err == nil {
		return // already done
	}
	files, _ := bundledMusic.ReadDir("assets/music")
	for _, f := range files {
		dest := filepath.Join(musicDir, f.Name())
		if _, err := os.Stat(dest); os.IsNotExist(err) {
			data, _ := bundledMusic.ReadFile("assets/music/" + f.Name())
			os.WriteFile(dest, data, 0644)
		}
	}
	os.WriteFile(marker, []byte(""), 0644)
	fmt.Println("Bundled songs copied!")
}

func (a *App) connectDiscord() {
	for {
		if err := client.Login("1488909991254556794"); err == nil {
			fmt.Println("Discord RPC connected!")
			return
		}
		fmt.Println("Discord not running, retrying in 5s...")
		time.Sleep(5 * time.Second)
	}
}

func (a *App) UpdatePresence(title, artist string) {
	if artist == "" {
		artist = "Unknown Artist"
	}
	activity := client.Activity{
		Details:    title,
		State:      "by " + artist,
		LargeImage: "music_icon",
		LargeText:  "Listening to " + title,
		SmallImage: "riff_logo",
		SmallText:  "RIFF",
		Buttons:    []*client.Button{{Label: "Get RIFF", Url: "https://github.com/poison291/Riff-Music-Player"}},
	}
	if err := client.SetActivity(activity); err != nil {
		client.Logout()
		if client.Login("1488909991254556794") == nil {
			client.SetActivity(activity)
		}
	}
}

func (a *App) ClearPresence() { client.Logout() }

func (a *App) GetSongs() []Song {
	home, _ := os.UserHomeDir()
	files, err := os.ReadDir(filepath.Join(home, "music"))
	if err != nil {
		return nil
	}
	var songs []Song
	for i, file := range files {
		if file.IsDir() { continue }
		ext := strings.ToLower(filepath.Ext(file.Name()))
		if ext != ".mp3" && ext != ".wav" && ext != ".flac" { continue }

		fullPath := filepath.Join(home, "music", file.Name())
		f, err := os.Open(fullPath)
		if err != nil { continue }
		meta, _ := tag.ReadFrom(f)
		f.Close()

		title, artist, album, image := file.Name(), "", "", ""
		if meta != nil {
			if meta.Title() != "" { title = meta.Title() }
			artist, album = meta.Artist(), meta.Album()
			if pic := meta.Picture(); pic != nil {
				image = "data:" + pic.MIMEType + ";base64," + base64.StdEncoding.EncodeToString(pic.Data)
			}
		}

		songs = append(songs, Song{
			ID:        i + 1,
			Title:     title,
			Artist:    artist,
			Album:     album,
			Path:      fullPath,
			Ext:       ext,
			Image:     image,
			StreamURL: "http://localhost:9876/" + url.PathEscape(file.Name()),
			Bundled:   bundledNames[file.Name()], // map lookup, much cleaner than loop
		})
	}
	return songs
}