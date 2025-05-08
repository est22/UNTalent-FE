import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Tooltip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ErrorIcon from '@mui/icons-material/Error';
import './FileUpload.css';
import useResumeUpload from '../../../hooks/useResumeUpload';
import useAuth from '../../../hooks/useAuth';
import { useUserSettings } from '../../../UserSettingsContext';

const FileUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { resumeLabel, labelVectorize, fetchJobByVectorized, fectchJobByExistFile } = useResumeUpload();
  const { user, /* isAuthenticated */ } = useAuth();
  const { userSettings, /* setUserSettings */ } = useUserSettings();
  const [existResume, setExistResume] = useState(false);

  useEffect(() => {
    setExistResume(!!userSettings?.filename);
  }, [userSettings?.filename]);
  useEffect(() => {
    const previouslyAgreed = sessionStorage.getItem('agreedToTerms') === 'true';
    setAgreedToTerms(previouslyAgreed);
  }, []);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError(null);
    }
  };

  const { getRootProps, /* getInputProps */ } = useDropzone({
    onDrop,
    disabled: isLoading,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  const renderUploadContent = () => {
    return (
      <>
        <InsertDriveFileIcon className="file-icon" />
        <p>
          {selectedFile
            ? `Selected: ${selectedFile.name}`
            : existResume
            ? `Saved: ${userSettings?.filename}`
            : 'Drag resume here, or click to select'}
        </p>
      </>
    );
  };

  const handleUpload = async () => {
    if (selectedFile && agreedToTerms) {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      try {
        // Step 1: Label Resume
        const labelFormData = new FormData();
        labelFormData.append('file', selectedFile);
        const labeledResume = await resumeLabel(labelFormData);
        setProgress(33);

        // Step 2: Vectorize Resume
        const vectorizedResume = await labelVectorize(labeledResume);
        setProgress(66);

        // Step 3: Upload and Match Jobs
        const result = await fetchJobByVectorized(vectorizedResume);
        setProgress(100);
        onUpload(result);
        setSelectedFile(null);
      } catch (err) {
        console.error('Error in handleUpload:', err);
        setError(err.message || 'An error occurred while processing your resume');
      } finally {
        setIsLoading(false);
        setSelectedFile(null);
        setProgress(0);
      }
    }
  };

  const handleExistFile = async () => {
    try {
      setIsLoading(true);
      const result = await fectchJobByExistFile(userSettings.user_id);
      onUpload(result);
      setIsLoading(false);
      setExistResume(false);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgreementChange = (event) => {
    const agreed = event.target.checked;
    setAgreedToTerms(agreed);
    sessionStorage.setItem('agreedToTerms', agreed);
  };

  return (
    <Box className="file-upload-section">
      <Typography variant="subtitle1" className="upload-header">
        <CloudUploadIcon className="upload-header-icon" />
        Boost your job search with resume matching
      </Typography>
      <Box
        className="file-upload-container"
        // Keep redirection commented out
        // --- TEMP: Login Gate handles auth, redirection disabled START ---
        // onClick={() => !isAuthenticated && handleLoginRedirect()} 
        // sx={{ ... }}
        // --- TEMP: Login Gate handles auth, redirection disabled END ---
      >
        <Box> { /* Simplified Box wrapper */}
          <Tooltip title="Accepted formats: PDF, DOC, DOCX, TXT" arrow>
            <div {...getRootProps()} className="input-container">
              {/* Removed the explicit input element */}
              {renderUploadContent()}
            </div>
          </Tooltip>
          {error && (
            <Typography color="error" variant="body2" style={{ marginTop: '8px' }}>
              <ErrorIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {error}
            </Typography>
          )}
          <div className="action-container">
            <FormControlLabel
              control={
                <Checkbox checked={agreedToTerms} onChange={handleAgreementChange} color="primary" size="small" />
              }
              label={<span className="agreement-container">I agree to the terms of service & privacy policy</span>}
            />
            <Button
              variant="contained"
              onClick={selectedFile ? handleUpload : existResume ? handleExistFile : undefined}
              disabled={(!selectedFile && !userSettings?.filename) || !agreedToTerms || isLoading}
              className="upload-button"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : selectedFile ? (
                'Match Jobs Now'
              ) : existResume ? (
                'Match Jobs with Saved Resume'
              ) : (
                'Match Jobs Now' /* Fallback or disable if no file/saved resume */
              )}
            </Button>
          </div>
          {isLoading && (
            <LinearProgress variant="determinate" value={progress} style={{ marginTop: '10px' }} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FileUpload;
