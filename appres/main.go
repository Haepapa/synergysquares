package main

import (
	"crypto/tls"
	"log"
	"net/http"

	col "appres/collections"

	app "github.com/Haepapa/appres"
)

func main() {
    // Suppress insecure warning (if using self-signed certificates)
    http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

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
    colPlayerID, err := col.Player(db)
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }
    colCellID, err := col.Cell(db)
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }
    col.Game(db, colPlayerID, colCellID)

    log.Println("Successfully created database, collection, and attributes!")
}