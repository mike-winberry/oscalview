import React from 'react';
import Box from '@mui/material/Box';
import JsonViewer from './JsonViewer';

function FileDisplay({ validationResult }: { validationResult: object | null }) {
  if (!validationResult) return null;

  return (
    <Box
      sx={{
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '100%',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
      data-testid="validation-result-Display"
    >
      <JsonViewer code={JSON.stringify(validationResult, null, 2)} />
    </Box>
  );
}

export default FileDisplay;
