import React from 'react';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ResultAlert = ({ open, onClose, title = 'Success', description = '' }) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      PaperProps={{
        style: {
          borderRadius: '12px',
          padding: '20px',
          minWidth: '300px',
        },
      }}
    >
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 60,
              color: '#9BE89B',
            }}
          />

          <Box textAlign="center">
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            {description && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {description}
              </Typography>
            )}
          </Box>

          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: '#6B5ECD',
              '&:hover': {
                bgcolor: '#5B4FB3',
              },
              borderRadius: '8px',
              minWidth: '100px',
              mt: 1,
            }}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResultAlert;
