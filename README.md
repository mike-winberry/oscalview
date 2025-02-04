<div>
  <img src="./public/oscalot.svg" alt="OSCALot Logo" width="200" height="200"/>
  <img src="./public/oscalot_name.svg" alt="OSCALot Logo" width="200" height="200"/>
</div>

[![Netlify Status](https://api.netlify.com/api/v1/badges/1a93af9c-1154-4cd1-b165-71c3742747ed/deploy-status)](https://app.netlify.com/sites/oscalot/deploys)

## A tool for validating OSCAL documents try it out at [oscalot.dev](https://oscalot.dev).


### Features
 - UI for uploading OSCAL documents and viewing validation results.
 - Public API for validating OSCAL documents.
   - /api/validate
     - Validates an OSCAL document and returns the validation results.
     - POST requests can validate a file by passing the file name in the request body using `form: { data: fileContent }`

Example:
```
curl -X POST https://oscalot.com/api/validate \
  -H "Content-Type: multipart/form-data" \
  -F "data=@path/to/oscal/document.yaml"
```

### Planned Features
- Single-file Multi-document yaml validation
- Multi-file json/yaml validation
- Editing OSCAL documents
- Upgrading OSCAL documents to the next version

 
 ### Maintainers
 - [Cole (Michael) Winberry](https://github.com/mike-winberry)