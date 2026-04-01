package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Game(db *models.Database) (string, error) {

    // Create collection.
    // After creation, set via Appwrite console or REST API:
    //   - documentSecurity: true
    //   - permissions: ["read(\"users\")", "create(\"users\")"]
    //
    // NOTE: Do NOT add relationship attributes to this collection via the
    // provisioner — Appwrite 1.7.4 has a bug where relationship attributes
    // can silently corrupt the underlying MariaDB schema, causing all
    // subsequent createDocument calls to fail with 400/500 errors.
    colGames, err := app.CreateCollection(db.Id, "game")
    if err != nil {
        log.Println("Error creating collection:", err)
        return "", err
    }

    attVals := []app.AttributeType{
        {
            Type:     "string",
            Name:     "name",
            Size:     200,
            Required: true,
        },
        {
            Type:     "string",
            Name:     "status",
            Size:     50,
            Required: true,
        },
        {
            Type:     "string",
            Name:     "boardColor",
            Size:     20,
            Required: false,
            Default:  "#9333ea",
        },
        {
            Type:     "string",
            Name:     "userId",
            Size:     100,
            Required: false,
        },
        {
            // Shareable join token; empty string until host generates one.
            Type:     "string",
            Name:     "token",
            Size:     100,
            Required: false,
            Default:  "",
        },
        {
            Type:     "integer",
            Name:     "boardSize",
            Required: false,
        },
        {
            Type:     "boolean",
            Name:     "isHost",
            Required: false,
        },
        {
            Type:     "datetime",
            Name:     "createdAt",
            Required: false,
        },
        {
            // Null until game transitions to "playing".
            Type:     "datetime",
            Name:     "startTime",
            Required: false,
        },
        {
            // Parallel array: content of each cell (index-aligned with cellsMarked).
            Type:     "string",
            Name:     "cellContents",
            Size:     500,
            Required: false,
            Array:    true,
        },
        {
            // Parallel array: marked state of each cell (index-aligned with cellContents).
            Type:     "boolean",
            Name:     "cellsMarked",
            Required: false,
            Array:    true,
        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colGames.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return "", err
        }
    }
    // Also create indexes:
    //   idx_userId: key index on userId (for getUserGames queries)
    //   idx_token:  key index on token  (for getGameByToken queries)
    return colGames.Id, nil
}
