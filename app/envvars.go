package app

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Export vrs
var (
    AppwriteEndpointURL string
    AppwriteProjectID  string
    AppwriteRESDEFAPIKey    string
)

func Envvars() {
    // Load .env.local file
    err := godotenv.Load(".env.local")
    if err != nil {
        log.Fatalf("Error loading .env.local file")
    }

    // Reference variables
    AppwriteEndpointURL = os.Getenv("NEXT_PUBLIC_APPWRITE_ENDPOINT")
    AppwriteProjectID = os.Getenv("NEXT_PUBLIC_APPWRITE_PROJECT")
    AppwriteRESDEFAPIKey = os.Getenv("APPWRITE_API_KEY_RESDEF")
}