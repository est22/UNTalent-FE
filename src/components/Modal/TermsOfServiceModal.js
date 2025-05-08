import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  FormGroup,
  Stack,
  Dialog,
  useMediaQuery,
  Link,
} from '@mui/material';

const TermsOfServiceModal = ({ onSubmit, onClose }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleCheckboxChange = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAcceptAll = () => {
    setAgreements({
      terms: true,
      privacy: true,
      marketing: true,
    });
  };

  const canProceed = agreements.terms && agreements.privacy;

  const handleSubmit = () => {
    if (canProceed) {
      onSubmit(agreements);
    }
  };

  const renderContent = (type) => {
    if (isMobile) {
      return (
        <Box sx={{ ml: 4, mt: 1 }}>
          <Link href={`/${type}.html`} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
            <Button variant="text" color="primary" size="small">
              View {type === 'terms-of-service' ? 'Terms of Service' : 'Privacy Policy'}
            </Button>
          </Link>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          ml: 4,
          mt: 1,
          height: '200px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          p: 2,
        }}
      >
        <iframe
          src={`/${type}.html`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={type === 'terms-of-service' ? 'Terms of Service' : 'Privacy Policy'}
        />
      </Box>
    );
  };

  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
    >
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box textAlign="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Unified Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please agree to the terms of service
            </Typography>
          </Box>

          <Divider />

          {/* Accept All */}
          <Box
            sx={{
              bgcolor: 'action.hover',
              p: 2,
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Accept all terms and conditions
            </Typography>
            <Button variant="outlined" size="small" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </Box>

          {/* Terms List */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            <FormGroup>
              <Stack spacing={3}>
                {/* Terms of Service */}
                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={agreements.terms} onChange={() => handleCheckboxChange('terms')} />}
                    label={
                      <Typography variant="subtitle2" color="text.primary">
                        [Required] Terms of Service
                      </Typography>
                    }
                  />
                  {renderContent('terms-of-service')}
                </Box>

                {/* Privacy Policy */}
                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={agreements.privacy} onChange={() => handleCheckboxChange('privacy')} />}
                    label={
                      <Typography variant="subtitle2" color="text.primary">
                        [Required] Privacy Policy
                      </Typography>
                    }
                  />
                  {renderContent('privacy')}
                </Box>

                {/* Marketing Consent */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox checked={agreements.marketing} onChange={() => handleCheckboxChange('marketing')} />
                    }
                    label={
                      <Typography variant="subtitle2" color="text.primary">
                        [Optional] Marketing Communications
                      </Typography>
                    }
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>
                    Would you like to receive marketing information about events and benefits?
                  </Typography>
                </Box>
              </Stack>
            </FormGroup>
          </Paper>

          {/* Bottom Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" disabled={!canProceed} onClick={handleSubmit}>
              Agree and Sign Up
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default TermsOfServiceModal;
