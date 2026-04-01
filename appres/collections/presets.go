package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)

// Presets creates the presets collection in the given database.
//
// After creation the collection must be configured via the Appwrite console
// or REST API:
//   - documentSecurity: true   (per-document permissions take effect)
//   - permissions: ["read(\"users\")", "create(\"users\")"]
//     read  → allows queries across users (e.g. shared preset lookup)
//     create → allows any logged-in user to create preset documents
func Presets(db *models.Database) (string, error) {

	colPresets, err := app.CreateCollection(db.Id, "presets")
	if err != nil {
		log.Println("Error creating collection:", err)
		return "", err
	}

	attVals := []app.AttributeType{
		{
			// Appwrite user ID of the preset owner.
			Type:     "string",
			Name:     "userId",
			Size:     100,
			Required: true,
			Array:    false,
			Encrypt:  false,
		},
		{
			Type:     "string",
			Name:     "name",
			Size:     100,
			Required: true,
			Array:    false,
			Encrypt:  false,
		},
		{
			// Each element is a bingo cell string.
			Type:     "string",
			Name:     "content",
			Size:     500,
			Required: false,
			Array:    true,
			Encrypt:  false,
		},
		{
			Type:     "datetime",
			Name:     "createdAt",
			Required: false,
			Array:    false,
			Encrypt:  false,
		},
		{
			Type:     "datetime",
			Name:     "updatedAt",
			Required: false,
			Array:    false,
			Encrypt:  false,
		},
	}

	for _, att := range attVals {
		err = app.CreateAttribute(db.Id, colPresets.Id, att)
		if err != nil {
			log.Println("Error creating attribute:", err)
			return "", err
		}
	}

	return colPresets.Id, nil
}
