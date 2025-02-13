import CodeMirror from '@uiw/react-codemirror';
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
import { ValidationResult } from '@/lib/types/gen';

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
  const [validationResult, setValidationResult] = useState('');
  const [scrollAnchor, setScrollAnchor] = useState<'top' | 'bottom'>('bottom');
  // Refs
  const previousFileRef = useRef<UploadedFile | null>(null);
  const debouncedUpdateContentRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!validating && selectedFile?.content !== previousFileRef.current?.content) {
      previousFileRef.current = selectedFile;
      handleValidate().then((validationResult: ValidationResult) => {
        updateFile({
          ...selectedFile,
          validationResult,
        });
      });
    }
  }, [selectedFile, handleValidate, validating, updateFile]);

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
