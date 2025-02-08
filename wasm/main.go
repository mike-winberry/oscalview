//go:build js && wasm
// +build js,wasm

package main

import (
	"fmt"
	"syscall/js"

	"github.com/defenseunicorns/go-oscal/src/pkg/model"
	"github.com/defenseunicorns/go-oscal/src/pkg/validation"
	"github.com/santhosh-tekuri/jsonschema/v6"
)

func validateOscal(this js.Value, p []js.Value) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	// Check if the input is an array and extract the first element
	// Formidable returns an array of objects, so we need to extract the first element
	// will also allow for future use of multiple files implementations
	var inputString string
	if p[0].Type() == js.TypeObject && p[0].Length() > 0 {
		inputString = p[0].Index(0).String()
	} else {
		inputString = p[0].String()
	}

	// semverPattern := `(?:\"?oscal-version\"?:\s*\"?(\d+\.\d+\.\d+)\"?)`

	// re := regexp.MustCompile(semverPattern)

	// if !re.MatchString(inputString) {
	// 	return js.ValueOf(map[string]interface{}{"error": "missing required metadata field oscal-version"})
	// }

	inputBytes := []byte(inputString)

	// Create a new validator
	validator, err := validation.NewValidator(inputBytes)
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to create validator: %s", err)})
	}

	// Validate the input
	err = validator.Validate()
	if err != nil {
		// If the error is not a validation error, return the error
		_, ok := err.(*jsonschema.ValidationError)
		if !ok {
			return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to run validation: %s", err)})
		}
	}

	// Get the validation result
	validationResponse, err := validator.GetValidationResult()
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to get validation result: %s", err)})
	}

	jsonResult, err := model.CoerceToJsonMap(validationResponse)
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to coerce to json: %s", err)})
	}

	return js.ValueOf(jsonResult)
}

func main() {
	js.Global().Set("validateOscal", js.FuncOf(validateOscal))
	select {}
}
