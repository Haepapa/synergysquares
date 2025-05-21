package app

import (
	"fmt"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/models"
)

// Export vrs
var (
	AppwriteDatabase *databases.Databases
)

func Utils(){
	Envvars()
	client := appwrite.NewClient(
		appwrite.WithEndpoint(AppwriteEndpointURL),
		appwrite.WithProject(AppwriteProjectID),
		appwrite.WithKey(AppwriteRESDEFAPIKey),
	)
	AppwriteDatabase = appwrite.NewDatabases(client)
}

func CreateDatabase(name string) (*models.Database, error) {
	// List all databases
	databases, err := AppwriteDatabase.List()
	if err != nil {
		fmt.Println("Error listing databases:", err)
		return nil, err
	}
	for _, db := range databases.Databases {
		if db.Name == name {
			fmt.Println("Database already exists with id:", db.Id)
			return &db, nil
		}
	}
	// Create a database
	db, err := AppwriteDatabase.Create(id.Unique(), name)
	if err != nil {
		fmt.Println("Error creating database:", err)
		return nil, err
	}
	fmt.Println("Database created with id:", db.Id)
	return db, nil
}
func CreateCollection(dbId string, name string) (*models.Collection, error) {
	// List all collections
	collections, err := AppwriteDatabase.ListCollections(dbId)
	if err != nil {
		fmt.Println("Error listing collections:", err)
		return nil, err
	}
	for _, col := range collections.Collections {
		if col.Name == name {
			fmt.Println("Collection already exists with id:", col.Id)
			return &col, nil
		}
	}
	// Create a collection
	col, err := AppwriteDatabase.CreateCollection(dbId, id.Unique(), name)
	if err != nil {
		fmt.Println("Error creating collection:", err)
		return nil, err
	}
	fmt.Println("Collection created with id:", col.Id)
	return col, nil
}