import FolderOpen from '@mui/icons-material/FolderOpen';
import Button, { ButtonProps } from '@mui/material/Button';

type variant = 'link' | 'button';

function ExampleFilesLink({ variant = 'link', buttonProps = {} }: { variant?: variant; buttonProps?: ButtonProps }) {
  return (
    <Button
      component={variant === 'link' ? 'a' : 'button'}
      startIcon={<FolderOpen />}
      href="https://github.com/mike-winberry/oscalot/tree/main/test-data/oscal"
      target="_blank"
      rel="noopener noreferrer"
      {...buttonProps}
    >
      Example Files
    </Button>
  );
}

export default ExampleFilesLink;
