import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function Error() {
  return (
    <Box sx={{ display: 'flex' }}>
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                This is an error alert — <strong>check it out!</strong>
            </Alert>
        </Stack>
    </Box>
  );
}