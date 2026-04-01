package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Game(db *models.Database, colBoardID string) (string, error) {

    // Create collection(s).
    // NOTE: After creation the collection must be updated to set:
    //   - documentSecurity: true  (enables per-document permissions)
    //   - permissions: ["read(\"users\")", "create(\"users\")"]
    //     read  → allows any logged-in user to query by token (join flow)
    //     create → allows any logged-in user to create game documents
    // The appres library does not currently expose these fields; update via
    // the Appwrite console or REST API after running this provisioner.
    colGames, err := app.CreateCollection(db.Id, "game")
    if err != nil {
        log.Println("Error creating collection:", err)
        return "", err
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
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
            // Set when the game transitions to "playing"; null until then.
            Type:        "datetime",
            Name:        "startTime",
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
            Name:        "createdAt",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            // Shareable game token (optional until host generates one).
            Type:        "string",
            Name:        "token",
            Size:        100,
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            // Appwrite user ID of the game host; used to query user's games.
            Type:        "string",
            Name:        "userId",
            Size:        100,
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
        {
            // Parallel array: content of each cell (index-aligned with cellsMarked).
            Type:        "string",
            Name:        "cellContents",
            Size:        500,
            Required:    false,
            Array:       true,
            Encrypt:     false,
        },
        {
            // Parallel array: marked state of each cell (index-aligned with cellContents).
            Type:        "boolean",
            Name:        "cellsMarked",
            Required:    false,
            Array:       true,
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