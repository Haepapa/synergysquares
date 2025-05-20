package main

import (
	"fmt"

	"crypto/tls"
	"net/http"

	"github.com/Haepapa/synergysquares/tree/resource-def/app"
	"github.com/appwrite/sdk-for-go/id"
)


func main() {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	app.Utils()

	// Create a database
	_, err := app.AppwriteDatabase.Create(id.Unique(), "synergysquares")
	if err != nil {
		fmt.Println("Error creating document:", err)
		return
	}
}