package main

import (
	"fmt"
	"os"
)

func main(){
	DirName := "C:\\Users\\susan\\Music"
	
	files, err := os.ReadDir(DirName)
	
	if err != nil{
		fmt.Println("Error in Reading Music Directory")
	}
	
	for i, file := range files{
		if file.IsDir(){
			fmt.Printf("Directory %s \n", file.Name())
		}else {
			info, _ := file.Info()  
			fmt.Printf("%d File: %s Size: %d Kilobytes \n",i+1, file.Name(), info.Size()/1024)
			
		}
	}

	
	
}