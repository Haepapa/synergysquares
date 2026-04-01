package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"

	col "appres/collections"

	app "github.com/Haepapa/appres"
)

func main() {
    // Allow self-signed TLS only when APPWRITE_SELF_SIGNED=true (local dev).
    // Remove or leave unset in production to enforce proper certificate validation.
    if os.Getenv("APPWRITE_SELF_SIGNED") == "true" {
        http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true} //nolint:gosec
    }

    // Initialize Appwrite client
    app.Utils()

    // Create a database
    db, err := app.CreateDatabase("synergysquares")
    if err != nil {
        log.Println("Error creating database:", err)
        return
    }

    // Create collection(s)
    col.ContactUs(db)
    colCellID, err := col.Cell(db)
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }
    colBoardID, err := col.Board(db, colCellID)
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }
    colGameID, err := col.Game(db, colBoardID)
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }
    col.Player(db, colBoardID, colGameID)

    log.Println("Successfully created database, collection, and attributes!")
}