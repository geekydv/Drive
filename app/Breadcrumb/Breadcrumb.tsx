import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


export default function CustomSeparator({breadcrumbs, updatecontainerdata}) {
  function handleClick(breadcrumb) {
    updatecontainerdata(breadcrumb);
  }
  return (
  <Stack spacing={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={index}>
              {index < breadcrumbs.length - 1 ? (
                <Link underline="hover" color="inherit" onClick={() => handleClick(breadcrumb)}>
                  {breadcrumb}
                </Link>
              ) : (
                <Typography color="text.primary">{breadcrumbs[breadcrumbs.length - 1]}</Typography>
              )}
            </span>
          ))}
        </Breadcrumbs>
      </Stack>
    );
}
