import { renderHook, act, waitFor } from '@testing-library/react';
import useFileManager from '../useFileManager';

// Mock the prettify function
jest.mock('../../lib/utils', () => ({
  prettify: jest.fn((content: string) => {
    return Promise.resolve({ result: content, formatError: undefined }); // Mocked response
  }),
}));

// Mock the FileReader
global.FileReader = class {
  static EMPTY = 0;
  static LOADING = 1;
  static DONE = 2;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onload: any;
  readAsText = jest.fn(() => {
    this.onload({ target: { result: 'test' } }); // Simulate file read
  });
} as unknown as typeof FileReader;

describe('useFileUpload', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useFileManager());
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.handleFileUpload).toBeDefined();
  });

  it('should handle file change', async () => {
    const { result } = renderHook(() => useFileManager());
    const file = new File(['test'], 'test.json', { type: 'application/json' });

    await act(async () => {
      result.current.handleFileUpload({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
      await waitFor(() => result.current.selectedFile !== null);
    });
    expect(result.current.selectedFile).toEqual({
      content: 'test',
      name: 'test.json',
      file,
      extension: 'json',
      validationResult: undefined,
    });
  });

  it('should handle file change with no file', () => {
    const { result } = renderHook(() => useFileManager());
    act(() => {
      result.current.handleFileUpload({ target: { files: [] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.selectedFile).toBeNull();
  });
});
