import { renderHook, act, waitFor } from '@testing-library/react';
import useFileManager from '../useFileManager';

describe('useFileUpload', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useFileManager());
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.handleFileUpload).toBeDefined();
  });

  it('should handle file change', async () => {
    const { result } = renderHook(() => useFileManager());
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    await act(async () => {
      result.current.handleFileUpload({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
      await waitFor(() => result.current.selectedFile !== undefined);
    });

    expect(result.current.selectedFile).toEqual({ content: 'test', name: 'test.txt', file });
  });

  it('should handle file change with no file', () => {
    const { result } = renderHook(() => useFileManager());
    act(() => {
      result.current.handleFileUpload({ target: { files: [] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.selectedFile).toBeNull();
  });
});
