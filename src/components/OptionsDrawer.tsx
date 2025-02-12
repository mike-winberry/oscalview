import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import UploadFile from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useFileValidation } from '@/context/FileValidationContext';
import { handleDownload } from '@/lib/utils';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)({
  paddingLeft: 0,
  paddingRight: 0,
});

const StyledListItemIcon = styled(ListItemIcon)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '1rem',
});

const StyledTypography = styled(Typography)({
  variant: 'body1',
  component: 'div',
});

const StyledListItemButton = styled(ListItemButton)({
  width: '100%',
});

export default function OptionsDrawer() {
  const { selectedFile, deleteFile, handleFileUpload, uploading, validating } = useFileValidation();
  const [open, setOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(56);

  const handleOpen = () => {
    setOpen(true);
    setDrawerWidth(250);
  };

  const handleClose = () => {
    setOpen(false);
    setDrawerWidth(56);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'open':
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
        break;
      case 'upload':
        document.getElementById('options-drawer-file-upload')?.click();
        break;
      case 'download':
        if (selectedFile) {
          handleDownload(selectedFile);
        }
        break;
      case 'delete':
        if (selectedFile) {
          deleteFile(selectedFile);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Drawer
      variant="permanent"
      elevation={8}
      PaperProps={{ elevation: 8 }}
      sx={{
        width: drawerWidth,
        padding: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, position: 'relative', padding: 0, overflowX: 'hidden' },
      }}
    >
      <input
        data-testid="options-drawer-file-upload"
        id="options-drawer-file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <List>
        <StyledListItem>
          <StyledListItemButton onClick={() => handleAction('open')}>
            <Tooltip title={open ? 'shrink' : 'expand'}>
              <StyledListItemIcon>
                {open ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                <StyledTypography>{open ? 'shrink' : 'expand'}</StyledTypography>
              </StyledListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </StyledListItem>
        <Divider />
        <StyledListItem>
          <StyledListItemButton
            data-testid="upload-button-options-drawer"
            onClick={() => handleAction('upload')}
            disabled={uploading || validating}
          >
            <Tooltip title="Upload File">
              <StyledListItemIcon>
                <UploadFile />
                <StyledTypography>Upload File</StyledTypography>
              </StyledListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </StyledListItem>
        <StyledListItem>
          <StyledListItemButton
            data-testid="download-button-options-drawer"
            onClick={() => handleAction('download')}
            disabled={!selectedFile}
          >
            <Tooltip title="Download File">
              <StyledListItemIcon>
                <DownloadIcon />
                <StyledTypography>Download Selected File</StyledTypography>
              </StyledListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </StyledListItem>
        <StyledListItem>
          <StyledListItemButton
            data-testid="delete-button-options-drawer"
            onClick={() => handleAction('delete')}
            disabled={uploading || validating || !selectedFile}
          >
            <Tooltip title="Delete Selected File">
              <StyledListItemIcon>
                <DeleteIcon />
                <StyledTypography>Delete Selected File</StyledTypography>
              </StyledListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </StyledListItem>
      </List>
    </Drawer>
  );
}
