package app

import (
	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
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