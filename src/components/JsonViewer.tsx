import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import Box from '@mui/material/Box/Box';

const JsonViewer = ({ code }: { code: string }) => {
  return (
    <Box data-testid="json-viewer" sx={{ width: '100%', overflow: 'auto', textAlign: 'left' }}>
      <Highlight theme={themes.shadesOfPurple} code={code} language="tsx">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span>{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  );
};

export default JsonViewer;
