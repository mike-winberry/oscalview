import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import Box from '@mui/material/Box/Box';

const JsonViewer = ({ code }: { code: string }) => {
  return (
    <Highlight theme={themes.shadesOfPurple} code={code} language="json">
      {({ style, tokens, getLineProps, getTokenProps }) => {
        style.height = '100% !important';
        return (
          <Box style={{ ...style, margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span>{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </Box>
        );
      }}
    </Highlight>
  );
};

export default JsonViewer;
