import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

const EmailVerificationModal = ({ open, email, onClose }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle align="center">
        Email Verification Sent
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={3}>
          <EmailIcon color="primary" sx={{ fontSize: 60 }} />
          <Typography variant="h6" align="center">
            Please Check Your Email
          </Typography>
          <Typography align="center" color="text.secondary">
            A verification email has been sent to{' '}
            <Typography component="span" fontWeight="bold" display="inline">
              {email}
            </Typography>
            <br />
            Email verification is required to receive email notifications.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
