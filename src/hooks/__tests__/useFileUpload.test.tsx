import { renderHook, act } from '@testing-library/react';
import useFileUpload from '../useFileUpload';

describe('useFileUpload', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useFileUpload());
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.handleFileChange).toBeDefined();
  });

  it('should handle file change', () => {
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.selectedFile).toBe(file);
  });

  it('should handle file change with no file', () => {
    const { result } = renderHook(() => useFileUpload());
    act(() => {
      result.current.handleFileChange({ target: { files: [] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.selectedFile).toBeNull();
  });
});
