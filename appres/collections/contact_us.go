package collections
import (
    "log"
    "github.com/appwrite/sdk-for-go/models"
    app "github.com/Haepapa/appres"
)
func ContactUs(db *models.Database) {

    // Create collection(s)
    colContactUs, err := app.CreateCollection(db.Id, "contact_us")
    if err != nil {
        log.Println("Error creating collection:", err)
        return
    }

    // Create attributes in collection(s)
    attVals := []app.AttributeType{
        {
            Type:        "string",
            Name:        "name",
            Size:        100,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "email",
            Name:        "email",
            Size:        200,
            Required:    false,
            Default:     "email@email.com",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "subject",
            Size:        200,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
        {
            Type:        "string",
            Name:        "message",
            Size:        5000,
            Required:    false,
            Default:     "",
            Array:       false,
            Encrypt:     false,
        },
    }

    for _, att := range attVals {
        err = app.CreateAttribute(db.Id, colContactUs.Id, att)
        if err != nil {
            log.Println("Error creating attribute:", err)
            return
        }
    }
}