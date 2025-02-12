'use client';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { UploadedFile } from '@/lib/types/UploadedFile';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useFileValidation } from '@/context/FileValidationContext';

const truncateFileName = (name: string) => {
  const maxLength = 20;
  if (name.length <= maxLength) return name;
  const extension = name.slice(name.lastIndexOf('.'));
  return `${name.slice(0, maxLength - extension.length)}...${extension}`;
};

function FileList() {
  const { files, selectedFile, setSelectedFile, validating } = useFileValidation();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const selectedFileIndex = files.findIndex((file) => file.name === selectedFile?.name);

  return (
    <>
      {files.length > 0 && selectedFile ? (
        isSmallScreen ? (
          <Select
            sx={{ mx: 'auto', px: 1 }}
            value={selectedFileIndex}
            onChange={(event: SelectChangeEvent<number>) => {
              setSelectedFile(files[event.target.value as number] || files[0]);
            }}
            size="medium"
            variant="standard"
            inputProps={{ 'aria-label': 'Select file' }}
          >
            {files.map((file: UploadedFile, index) => (
              <MenuItem color="primary" key={file.name} value={index}>
                <Tooltip title={file.name} enterDelay={1000} disableInteractive>
                  <Typography variant="subtitle2">{truncateFileName(file.name ?? '')}</Typography>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Tabs
            value={selectedFileIndex}
            onChange={(_, value) => {
              if (validating) return;
              setSelectedFile(files[value] || files[0]);
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="open file tabs"
            sx={{ maxWidth: '75%' }}
          >
            {files.map((file: UploadedFile) => (
              <Tooltip key={file.name} title={file.name} enterDelay={1000} disableInteractive>
                <Tab label={truncateFileName(file.name ?? '')} />
              </Tooltip>
            ))}
          </Tabs>
        )
      ) : (
        <Typography variant="h6">No file selected</Typography>
      )}
    </>
  );
}

export default FileList;
