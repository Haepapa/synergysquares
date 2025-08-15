package app

import (
	"fmt"
	"log"

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
		log.Println("Error listing databases:", err)
		return nil, err
	}
	for _, db := range databases.Databases {
		if db.Name == name {
			log.Println("Database already exists with id:", db.Id)
			return &db, nil
		}
	}
	// Create a database
	db, err := AppwriteDatabase.Create(id.Unique(), name)
	if err != nil {
		log.Println("Error creating database:", err)
		return nil, err
	}
	log.Println("Database created with id:", db.Id)
	return db, nil
}
func CreateCollection(dbId string, name string) (*models.Collection, error) {
	// List all collections in database
	collections, err := AppwriteDatabase.ListCollections(dbId)
	if err != nil {
		log.Println("Error listing collections:", err)
		return nil, err
	}
	for _, col := range collections.Collections {
		if col.Name == name {
			log.Println("Collection already exists with id:", col.Id)
			return &col, nil
		}
	}
	// Create a collection
	col, err := AppwriteDatabase.CreateCollection(dbId, id.Unique(), name)
	if err != nil {
		log.Println("Error creating collection:", err)
		return nil, err
	}
	log.Println("Collection created with id:", col.Id)
	return col, nil
}

func CreateAttribute(dbID string, colID string, att AttributeType) (error){
	attributes, err := AppwriteDatabase.ListAttributes(dbID, colID)
	if err != nil {
		log.Println("Error listing attributes:", err)
		return err
	}
	for _, attr := range attributes.Attributes {
		if attrName, ok := attr["key"].(string); ok && attrName == att.Name {
			log.Println("Attribute already exists with key:", attr["key"])
			return nil
		}
	}
	// Create an attribute
	if att.Type == "string" {
		newAtt, err := AppwriteDatabase.CreateStringAttribute(
			dbID, 
			colID, 
			att.Name, 
			att.Size, 
			att.Required,
			AppwriteDatabase.WithCreateStringAttributeDefault(att.Default),
			AppwriteDatabase.WithCreateStringAttributeArray(att.Array),
			AppwriteDatabase.WithCreateStringAttributeEncrypt(att.Encrypt),
		)
		if err != nil {
			log.Println("error creating attribute:", err)
			return err
		}
		log.Println("attribute created with key:", newAtt.Key)
		return nil
	} else if att.Type == "email" {
		newAtt, err := AppwriteDatabase.CreateEmailAttribute(
			dbID,
			colID,
			att.Name,
			att.Required,
			AppwriteDatabase.WithCreateEmailAttributeDefault(att.Default),
			AppwriteDatabase.WithCreateEmailAttributeArray(att.Array),
		)
		if err != nil {
			log.Println("error creating attribute:", err)
			return err
		}
		log.Println("attribute created with key:", newAtt.Key)
		return nil
	}
	return fmt.Errorf("unsupported attribute type: %s", att.Type)
}

type AttributeType struct {
	Type string
	Name string
	Size int
	Required bool
	// Unique bool - not implemented in sdk (https://github.com/appwrite/sdk-for-go/blob/main/databases/databases.go)
	Default string
	Array bool
	Encrypt bool
}