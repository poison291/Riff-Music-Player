package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	home, _ := os.UserHomeDir()
	DirName := home+"/music"
	files, err := os.ReadDir(DirName)
	

	if err != nil {
		fmt.Println("Error in Reading Music Directory")
	}

	for id, file := range files {
		if file.IsDir() {
			continue
	}
	
	ext := strings.ToLower(filepath.Ext(file.Name()))
	if ext == ".mp3" || ext == ".wav" || ext == ".flac" {
		songInfo, err := file.Info()
		if err != nil{
			fmt.Println("Error on getting File info", err)
		}
		fmt.Printf("%d Song %s (ext: %s)\n", id+1, file.Name(), ext)
		fmt.Println(songInfo)
	}
	}

}
