import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { Box, useMediaQuery, Fab } from '@mui/material';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { UploadedFile } from '@/lib/types/UploadedFile';
import { langs } from '@uiw/codemirror-extensions-langs';
import { useFileValidation } from '@/context/FileValidationContext';
import * as prettier from 'prettier/standalone.js';
import babelPlugin from 'prettier/plugins/babel.js';
import estreePlugin from 'prettier/plugins/estree.js';
import yamlPlugin from 'prettier/plugins/yaml.js';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './CodeEditor.css';

// Memoizes the CodeMirror component to prevent unnecessary re-renders
const MemoizedCodeMirror = memo(CodeMirror, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});

const CodeEditor = () => {
  // Context
  const { selectedFile, handleValidate, validating, updateFile } = useFileValidation();
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // States
  const [content, setContent] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [scrollAnchor, setScrollAnchor] = useState<'top' | 'bottom'>('bottom');
  // Refs
  const previousFileRef = useRef<UploadedFile | undefined>(undefined);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // runs prettier and sets the file extension and validation result if prettier fails
  const prettify = useCallback(
    async (content: string, name: string) => {
      let fileExtension = '';
      let result = '';
      let validationResult = '';
      try {
        fileExtension = name.includes('json') ? 'json' : 'yaml';
        result = await prettier.format(content, {
          parser: fileExtension,
          plugins: [babelPlugin, estreePlugin, yamlPlugin],
          indentStyle: 'space',
          indentWidth: 5,
        });
      } catch (error) {
        if (error instanceof Error) {
          validationResult = JSON.stringify(error.message, null, 2);
          result = content;
        }
      }
      setFileExtension(fileExtension);
      setValidationResult(validationResult);
      return result;
    },
    [setFileExtension, setValidationResult]
  );

  // Runs when the selectedFile changes
  useEffect(() => {
    // Prettifies the content when the selectedFile changes
    if (selectedFile?.content !== undefined && selectedFile.content !== previousFileRef.current?.content) {
      prettify(selectedFile?.content || '', selectedFile?.name || '').then((content) => {
        setContent(content);
      });
    }
  }, [selectedFile, prettify, handleValidate]);

  // Validates the content when the selectedFile changes
  useEffect(() => {
    if (!validating && selectedFile && selectedFile.content !== previousFileRef.current?.content) {
      handleValidate();
      previousFileRef.current = selectedFile;
    }
  }, [selectedFile, handleValidate, validating]);

  // Sets the validation result when the selectedFile validationResult changes
  useEffect(() => {
    if (selectedFile?.validationResult) {
      setValidationResult(JSON.stringify(selectedFile?.validationResult, null, 2));
    }
  }, [selectedFile]);

  // Debounces the content update
  useEffect(() => {
    // If the debounceRef is not null or the validating state is true, clear the timeout
    // to prevent another validation from running while the first one is still running
    if (debounceRef.current !== null || validating === true) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    }
    // Debounces the content update
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
  }, [content, validating, updateFile, selectedFile]);

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
        {fileExtension === 'json' ? (
          <MemoizedCodeMirror
            value={content}
            id="code-editor-display"
            data-testid="code-editor-display"
            theme={isDark ? tokyoNight : tokyoNightDay}
            extensions={[basicSetup(), langs.json()]}
            onChange={(value) => {
              setContent(value);
            }}
          />
        ) : (
          <MemoizedCodeMirror
            value={content}
            data-testid="code-editor-display"
            theme={isDark ? tokyoNight : tokyoNightDay}
            extensions={[basicSetup(), langs.yaml()]}
            onChange={(value) => {
              setContent(value);
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
