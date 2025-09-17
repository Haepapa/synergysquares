package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Board(db *models.Database, colCellID string) (string, error) {

    // Create collection(s)
    colBoard, err := app.CreateCollection(db.Id, "board")
    if err != nil {
        return "", err
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
        {
            Type:        "string",
            Name:        "content",
            Size:        500,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "relationship",
            TwoWay:      true,
            RelatedCollectionID: colCellID,
            RelationshipType: "oneToMany",
            OnDelete:   "cascade",
            Name:        "cells",
            TwoWayKey:   "board",

        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colBoard.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return "", err
        }
    }
    return colBoard.Id, nil
}