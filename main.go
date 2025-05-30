package main

import (
	"fmt"

	"crypto/tls"
	"net/http"

	"github.com/Haepapa/synergysquares/tree/resource-def/app"
)


func main() {
	// supress insecure warning
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	// Initialize Appwrite client
	app.Utils()

	// Create a database
	db, err := app.CreateDatabase("synergysquares")
	if err != nil {
		fmt.Println("Error creating database:", err)
		return
	}

	// Create collection(s)
	colContactUs, err := app.CreateCollection(db.Id, "contact_us")
	if err != nil {
		fmt.Println("Error creating collection:", err)
		return
	}

	// Create attributes in collection(s)
	attVals := []app.AttributeType{
		{
		Type:        "string",
		Name: 	     "name",
		Size:        100,
		Required:    false,
		Default:     "",
		Array:       false,
		Encrypt:     false,
		},
		{
		Type:        "email",
		Name: 	     "email",
		Size:        200,
		Required:    false,
		Default:     "",
		Array:       false,
		Encrypt:     false,
		},
		{
		Type:        "string",
		Name: 	     "subject",
		Size:        200,
		Required:    false,
		Default:     "",
		Array:       false,
		Encrypt:     false,
		},
		{
		Type:        "string",
		Name: 	     "message",
		Size:        5000,
		Required:    false,
		Default:     "",
		Array:       false,
		Encrypt:     false,
		},
	}
	for _, att := range attVals {
		err = app.CreateAttribute(db.Id, colContactUs.Id, att)
		if err != nil {
			fmt.Println("Error creating attribute:", err)
			return
		}
	}

}