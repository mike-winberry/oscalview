import CodeMirror from '@uiw/react-codemirror';
import * as yamlPlugin from 'prettier/plugins/yaml.js';
import * as prettier from 'prettier/standalone.js';
import * as babelPlugin from 'prettier/plugins/babel.js';
import estreePlugin from 'prettier/plugins/estree.js';
import { Box, useMediaQuery, Fab } from '@mui/material';
import { UploadedFile } from '@/lib/types/UploadedFile';
import { langs } from '@uiw/codemirror-extensions-langs';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { useFileValidation } from '@/context/FileValidationContext';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import './CodeEditor.css';

// Memoizes the CodeMirror component to prevent unnecessary re-renders
const MemoizedCodeMirror = memo(CodeMirror, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});

// runs prettier and sets the file extension and validation result if prettier fails
async function prettify(content: string, extension: 'json' | 'yaml'): Promise<{ result: string; formatError: string }> {
  let result = '';
  let formatError = '';
  try {
    result = await prettier.format(content, {
      parser: extension,
      plugins: [babelPlugin, estreePlugin, yamlPlugin],
      indentStyle: 'space',
      indentWidth: 2,
    });
  } catch (error) {
    if (error instanceof Error) {
      formatError = JSON.stringify(error.message, null, 2);
      result = content;
    }
  }
  return { result, formatError };
}

const CodeEditor = () => {
  // Context
  const { selectedFile, handleValidate, validating, updateFile } = useFileValidation();
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // States
  const [validationResult, setValidationResult] = useState('');
  const [scrollAnchor, setScrollAnchor] = useState<'top' | 'bottom'>('bottom');
  // Refs
  const previousFileRef = useRef<UploadedFile | null>(null);
  const debouncedUpdateContentRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = useCallback(async () => {
    prettify(selectedFile?.content || '', selectedFile?.extension || 'json').then(async ({ result, formatError }) => {
      const validationResult = await handleValidate();
      const finalValidationResult = formatError ? { prettier: formatError, ...validationResult } : validationResult;
      updateFile({
        ...selectedFile,
        content: result,
        extension: selectedFile?.extension || 'json',
        validationResult: finalValidationResult,
      });
    });
  }, [selectedFile, updateFile, handleValidate]);

  useEffect(() => {
    if (!validating && selectedFile?.content !== previousFileRef.current?.content) {
      previousFileRef.current = selectedFile;
      handleFileChange();
    }
  }, [selectedFile, handleFileChange, validating]);

  // Sets the validation result when the selectedFile validationResult changes
  useEffect(() => {
    const stringifiedValidationResult = JSON.stringify(selectedFile?.validationResult, null, 2);
    if (stringifiedValidationResult !== validationResult) {
      setValidationResult(stringifiedValidationResult);
    }
  }, [selectedFile, validationResult]);

  const debouncedUpdateContent = useCallback(
    (value: string) => {
      if (debouncedUpdateContentRef.current) {
        clearTimeout(debouncedUpdateContentRef.current);
      }
      debouncedUpdateContentRef.current = setTimeout(() => {
        if (selectedFile) {
          updateFile({
            ...selectedFile,
            content: value,
          });
        }
      }, 1000);
    },
    [selectedFile, updateFile]
  );

  const scrollTo = (position: 'top' | 'bottom') => {
    const scrollContainer = document.getElementById(position === 'top' ? 'scroll-anchor-top' : 'scroll-anchor-bottom');
    scrollContainer?.scrollIntoView({ behavior: 'smooth' });
    if (position === 'top') {
      setScrollAnchor('bottom');
    } else {
      setScrollAnchor('top');
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: { xs: 'auto', md: 'hidden' },
          flexGrow: 1,
          height: '100%',
        }}
      >
        <div id="scroll-anchor-top" />
        {selectedFile?.extension === 'json' ? (
          <MemoizedCodeMirror
            value={selectedFile?.content}
            id="code-editor-display"
            data-testid="code-editor-display"
            theme={isDark ? tokyoNight : tokyoNightDay}
            extensions={[basicSetup(), langs.json()]}
            onChange={(value) => {
              if (previousFileRef.current) {
                debouncedUpdateContent(value);
              }
            }}
          />
        ) : (
          <MemoizedCodeMirror
            value={selectedFile?.content}
            data-testid="code-editor-display"
            theme={isDark ? tokyoNight : tokyoNightDay}
            extensions={[basicSetup(), langs.yaml()]}
            onChange={(value) => {
              if (previousFileRef.current) {
                debouncedUpdateContent(value);
              }
            }}
          />
        )}
        <MemoizedCodeMirror
          data-testid="validation-result-display"
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
          editable={false}
          value={validating ? 'Running validation...' : validationResult}
          theme={isDark ? tokyoNight : tokyoNightDay}
          extensions={[basicSetup(), langs.json()]}
        />
        <div id="scroll-anchor-bottom" />
      </Box>
      {isSmallScreen && (
        <Fab
          color="primary"
          aria-label="scroll"
          onClick={() => scrollTo(scrollAnchor)}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 24,
          }}
        >
          {scrollAnchor === 'bottom' ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </Fab>
      )}
    </>
  );
};

export default CodeEditor;
