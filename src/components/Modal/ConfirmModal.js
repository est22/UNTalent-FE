import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, title = 'Confirm', data = null }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
          <HelpOutlineIcon
            sx={{
              fontSize: 60,
              color: '#6B5ECD',
            }}
          />

          <Box textAlign="center">
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {message}
            </Typography>
            {data && (
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  fontWeight: 'bold',
                  wordBreak: 'break-all',
                }}
              >
                {data}
              </Typography>
            )}
          </Box>

          <Box display="flex" gap={2} mt={1}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                color: '#6B5ECD',
                borderColor: '#6B5ECD',
                '&:hover': {
                  borderColor: '#5B4FB3',
                  bgcolor: 'rgba(107, 94, 205, 0.04)',
                },
                borderRadius: '8px',
                minWidth: '100px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              sx={{
                bgcolor: '#6B5ECD',
                '&:hover': {
                  bgcolor: '#5B4FB3',
                },
                borderRadius: '8px',
                minWidth: '100px',
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
