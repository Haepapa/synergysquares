package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Game(db *models.Database, colPlayerID string, colCellID string) {

    // Create collection(s)
    colGames, err := app.CreateCollection(db.Id, "game")
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
            RelatedCollectionID: colPlayerID,
            RelationshipType: "manyToMany",
            OnDelete:   "setNull",
            Name:        "players",
            TwoWayKey:   "games",

        },
        {
            Type:        "relationship",
            TwoWay:      true,
            RelatedCollectionID: colCellID,
            RelationshipType: "oneToMany",
            OnDelete:   "cascade",
            Name:        "cells",
            TwoWayKey:   "game",

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