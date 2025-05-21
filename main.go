package main

import (
	"fmt"

	"crypto/tls"
	"net/http"

	"github.com/Haepapa/synergysquares/tree/resource-def/app"
	"github.com/appwrite/sdk-for-go/id"
)


func main() {
	// supress insecure warning
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	// Initialize Appwrite client
	app.Utils()

	// List all databases
	databases, err := app.AppwriteDatabase.List()
	if err != nil {
		fmt.Println("Error listing databases:", err)
		return
	}
	fmt.Println("Databases:")
	for _, db := range databases.Databases {
		fmt.Printf("ID: %s, Name: %s\n", db.Id, db.Name)
	}
	// Create a database
	db, err := app.AppwriteDatabase.Create(id.Unique(), "synergysquares1")
	if err != nil {
		fmt.Println("Error creating database:", err)
		return
	}
	fmt.Println("Database created with id:", db.Id)

	// Create a collection(s)
	colContactUs, err := app.AppwriteDatabase.CreateCollection(db.Id, id.Unique(), "contactus")
	if err != nil {
		fmt.Println("Error creating collection:", err)
		return
	}
	fmt.Println("Collection created with id:", colContactUs.Id)
}