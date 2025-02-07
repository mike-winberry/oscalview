import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { UploadedFile } from '@/lib/types/UploadedFile';
import { langs, loadLanguage } from '@uiw/codemirror-extensions-langs';
import { useFileValidation } from '@/context/FileValidationContext';
import * as prettier from 'prettier/standalone.js';
import babelPlugin from 'prettier/plugins/babel.js';
import estreePlugin from 'prettier/plugins/estree.js';
import './codeViewer.css';

loadLanguage('yaml');
loadLanguage('json');

const FileViewer = () => {
  // Context
  const { selectedFile, handleValidate, validating, updateFile } = useFileValidation();
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  // States
  const [content, setContent] = useState('');
  const [validationResult, setValidationResult] = useState('');

  // Refs
  const previousFileRef = useRef<UploadedFile | undefined>(undefined);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const prettify = useCallback(async (content: string, name: string) => {
    try {
      if (name.includes('json')) {
        return await prettier.format(content, {
          parser: 'json',
          plugins: [babelPlugin, estreePlugin],
        });
      } else {
        return content;
      }
    } catch (error) {
      setValidationResult(JSON.stringify(error, null, 2));
      return content;
    }
  }, []);

  // Runs when the selectedFile content changes
  useEffect(() => {
    if (selectedFile && selectedFile.content !== previousFileRef.current?.content) {
      handleValidate();
      previousFileRef.current = selectedFile;
    }
  }, [selectedFile, selectedFile?.content, handleValidate]);

  // Sets the content when the selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      prettify(selectedFile.content || '', selectedFile.name || '').then((content) => {
        setContent(content);
      });
    }
  }, [selectedFile?.content, selectedFile, prettify]);

  // Sets the validation result when the selectedFile validationResult changes
  useEffect(() => {
    if (selectedFile?.validationResult) {
      setValidationResult(JSON.stringify(selectedFile?.validationResult, null, 2));
    }
  }, [selectedFile?.validationResult]);

  // Debounces the content update
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateFile({
        ...selectedFile,
        content: content,
      });
    }, 1000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, validating, selectedFile, updateFile]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: { xs: 'auto', md: 'hidden' },
        flexGrow: 1,
        height: '100%',
      }}
    >
      <CodeMirror
        value={content}
        data-testid="code-editor-display"
        theme={isDark ? tokyoNight : tokyoNightDay}
        extensions={[basicSetup({ indentOnInput: true }), langs.yaml(), langs.json()]}
        onChange={(value) => {
          setContent(value);
        }}
      />

      <CodeMirror
        data-testid="validation-result-display"
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        editable={false}
        value={validating ? 'Running validation...' : validationResult}
        theme={isDark ? tokyoNight : tokyoNightDay}
        extensions={[basicSetup(), langs.json(), langs.yaml()]}
      />
    </Box>
  );
};

export default FileViewer;
