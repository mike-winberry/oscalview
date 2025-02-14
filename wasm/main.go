//go:build js && wasm
// +build js,wasm

package main

import (
	"fmt"
	"regexp"
	"syscall/js"

	"oscalot/wasm/lula"
	"oscalot/wasm/oscal"
)

func validateOscal(this js.Value, args []js.Value) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	// Check if the input is an array and extract the first element
	// Formidable returns an array of objects, so we need to extract the first element
	// will also allow for future use of multiple files implementations
	var inputString string
	if args[0].Type() == js.TypeObject && args[0].Length() > 0 {
		inputString = args[0].Index(0).String()
	} else {
		inputString = args[0].String()
	}

	isOscalDocument, err := regexp.MatchString(`oscal-version`, inputString)
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to match oscal document: %s", err)})
	}
	isLulaDocument, err := regexp.MatchString(`lula-version`, inputString)
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("failed to match lula document: %s", err)})
	}
	if !isOscalDocument && !isLulaDocument {
		return js.ValueOf(map[string]interface{}{"error": "invalid document type ensure the document contains oscal-version or lula-version"})
	}

	filePath := args[1].Index(0).String()
	extension := args[2].Index(1).String()
	inputBytes := []byte(inputString)

	if isOscalDocument {
		jsonResult := oscal.ValidateOscal(inputBytes, filePath)
		return js.ValueOf(jsonResult)
	} else if isLulaDocument && extension == "yaml" {
		jsonResult := lula.ValidateLula(inputBytes, filePath)
		return js.ValueOf(jsonResult)
	}

	return js.ValueOf(map[string]interface{}{"error": "lula documents must be a yaml file"})
}

func main() {
	js.Global().Set("validateOscal", js.FuncOf(validateOscal))
	select {}
}
