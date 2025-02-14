package oscal

import (
	"fmt"

	"github.com/defenseunicorns/go-oscal/src/pkg/model"
	"github.com/defenseunicorns/go-oscal/src/pkg/validation"
	"github.com/santhosh-tekuri/jsonschema/v6"
)

func ValidateOscal(contentBytes []byte, filePath string) map[string]interface{} {
	// Create a new validator
	validator, err := validation.NewValidator(contentBytes)
	if err != nil {
		return map[string]interface{}{"error": fmt.Sprintf("failed to create validator: %s", err)}
	}

	// Validate the input
	err = validator.Validate()
	if err != nil {
		// If the error is not a validation error, return the error
		_, ok := err.(*jsonschema.ValidationError)
		if !ok {
			return map[string]interface{}{"error": fmt.Sprintf("failed to run validation: %s", err)}
		}
	}

	// Get the validation result
	validationResponse, err := validator.GetValidationResult()
	if err != nil {
		return map[string]interface{}{"error": fmt.Sprintf("failed to get validation result: %s", err)}
	}
	validationResponse.Metadata.DocumentPath = filePath

	// Coerce the validation result to a json map
	jsonResult, err := model.CoerceToJsonMap(validationResponse)
	if err != nil {
		return map[string]interface{}{"error": fmt.Sprintf("failed to coerce to json: %s", err)}
	}

	return jsonResult
}
