package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Games(db *models.Database) {

    // Create collection(s)
    colGames, err := app.CreateCollection(db.Id, "games")
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
        {
            Type:        "string",
            Name:        "id",
            Size:        100,
            Required:    true,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "name",
            Size:        100,
            Required:    true,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "integer",
            Name:        "boardSize",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "boardColor",
            Size:        100,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "status",
            Size:        100,
            Required:    true,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "datetime",
            Name:        "startTime",
            Required:    true,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "integer",
            Name:        "winningPatterns",
            Required:    false,
            Array:       true,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "token",
            Size:        100,
            Required:    true,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "boolean",
            Name:        "isHost",
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "datetime",
            Name:        "createdAt",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colGames.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return
        }
    }
}
//TODO: (me) update go package for new types