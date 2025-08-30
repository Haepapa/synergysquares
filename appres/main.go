package main

import (
    "crypto/tls"
    "log"
    "net/http"
    
    app "github.com/Haepapa/appres"
	col "appres/collections"
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

    log.Println("Successfully created database, collection, and attributes!")
}