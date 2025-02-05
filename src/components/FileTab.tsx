import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import React from 'react';

function FileTab({ fileName }: { fileName: string }) {
  const truncateFileName = (name: string) => {
    const maxLength = 20;
    if (name.length <= maxLength) return name;
    const extension = name.slice(name.lastIndexOf('.'));
    return `${name.slice(0, maxLength - extension.length)}...${extension}`;
  };

  return (
    <Tabs value={0} sx={{ flexGrow: 1 }} variant="standard" indicatorColor="primary" textColor="primary">
      <Tooltip title={fileName} enterDelay={1000}>
        <Tab disableRipple sx={{ cursor: 'default' }} label={truncateFileName(fileName)} />
      </Tooltip>
    </Tabs>
  );
}

export default FileTab;
