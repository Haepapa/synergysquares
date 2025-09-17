package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Game(db *models.Database, colBoardID string) (string, error) {

    // Create collection(s)
    colGames, err := app.CreateCollection(db.Id, "game")
    if err != nil {
        log.Println("Error creating collection:", err)
        return "", err
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
        {
            Type:        "string",
            Name:        "id",
            Size:        100,
            Required:    true,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "name",
            Size:        100,
            Required:    true,
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
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "datetime",
            Name:        "startTime",
            Required:    true,
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
            Name:        "createdAt",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "relationship",
            TwoWay:      true,
            RelatedCollectionID: colBoardID,
            RelationshipType: "oneToMany",
            OnDelete:   "cascade",
            Name:        "boards",
            TwoWayKey:   "game",

        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colGames.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return "", err
        }
    }
    return colGames.Id, nil
}