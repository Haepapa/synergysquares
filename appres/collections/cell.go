package collections

import (
	"log"

	app "github.com/Haepapa/appres"
	"github.com/appwrite/sdk-for-go/models"
)
func Cell(db *models.Database) (string, error) {

    // Create collection(s)
    colCell, err := app.CreateCollection(db.Id, "cell")
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
            Type:        "boolean",
            Name:        "marked",
            Required:    false,
            Array:       false,
            Encrypt:     false,
        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colCell.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return "", err
        }
    }
    return colCell.Id, nil
}