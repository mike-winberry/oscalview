// go:build tools

package main

import (
	"encoding/json"
	"fmt"
	"log"

	validation "github.com/defenseunicorns/go-oscal/src/pkg/validation"
	"github.com/invopop/jsonschema"
)

type OscalotGenTypes struct {
	ValidationResult validation.ValidationResult
}

func GenerateTypes() ([]byte, error) {
	reflector := &jsonschema.Reflector{
		AllowAdditionalProperties:  true,
		RequiredFromJSONSchemaTags: true,
	}

	schema := reflector.Reflect(&OscalotGenTypes{})
	return json.MarshalIndent(schema, "", "  ")
}

func main() {
	schema, err := GenerateTypes()
	if err != nil {
		log.Fatalf("Failed to generate types: %v", err)
	}
	fmt.Println(string(schema))
}
