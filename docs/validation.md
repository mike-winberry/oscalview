# Documentation for `/api/validate` Endpoint

The `/api/validate` endpoint is designed to validate OSCAL (Open Security Controls Assessment Language) documents. It accepts POST requests with form data containing the OSCAL document as a string. The endpoint uses a WebAssembly module to perform the validation.

## Endpoint Details

- **URL**: `/api/validate`
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Form Field**: `data` (string containing the OSCAL document)

## Response

- **200 OK**: The request was successful, and the response will contain the validation result.
  - **Response Body**: A [ValidationResult JSON object](https://pkg.go.dev/github.com/defenseunicorns/go-oscal@v0.6.2/src/pkg/validation#ValidationResult)
- **400 Bad Request**: The request was malformed, typically due to missing data.
  - **Response Body**: `{ "error": "No data provided" }`
- **500 Internal Server Error**: An error occurred on the server, such as a failure to load the WASM module or parse the form.
  - **Response Body**: `{ "error": "Error message" }`

## Example Postman Requests

Below are examples of how to use Postman to send requests to the `/api/validate` endpoint using the provided `catalog.json` and `invalid-assessment-result.yaml` files.

### Example 1: Validating `catalog.json`

1. **Create a new POST request in Postman.**
2. **Set the URL** to `https://oscalview.netlify.app/api/validate`.
3. **Select the `Body` tab** and choose `form-data`.
4. **Add a new key-value pair**:

   - **Key**: `data`
   - **Value**: Paste the contents of `catalog.json` here.

5. **Send the request**.

**Expected Response**:

- Status: `200 OK`
- Body: JSON object indicating whether the document is valid.

### Example 2: Validating `invalid-assessment-result.yaml`

1. **Create a new POST request in Postman.**
2. **Set the URL** to `https://oscalview.netlify.app/api/validate`.
3. **Select the `Body` tab** and choose `form-data`.
4. **Add a new key-value pair**:

   - **Key**: `data`
   - **Value**: Paste the contents of `invalid-assessment-result.yaml` here.

5. **Send the request**.

**Expected Response**:

- Status: `200 OK`
- Body: JSON object indicating a [ValidationResult JSON object](https://pkg.go.dev/github.com/defenseunicorns/go-oscal@v0.6.2/src/pkg/validation#ValidationResult)
