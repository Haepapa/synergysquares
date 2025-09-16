package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Player(db *models.Database) (string, error) {

    // Create collection(s)
    colPlayer, err := app.CreateCollection(db.Id, "player")
    if err != nil {
        return "", err
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
        {
            Type:        "string",
            Name:        "id",
            Size:        100,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "name",
            Size:        100,
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "boolean",
            Name:        "isHost",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "datetime",
            Name:        "joinTime",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "boolean",
            Name:        "hasBingo",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colPlayer.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return "", err
        }
    }
    return colPlayer.Id, nil
}