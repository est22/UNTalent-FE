import React, { useState } from 'react';
import { Slider, Box, IconButton, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
// import { useUserSettings } from '../../../../UserSettingsContext';
import { Header } from './Header';
import SelectSection from './SelectSection';
import './UserProfile.css';
import useResumeUpload from '../../../../hooks/useResumeUpload';

const UserProfile = ({
  filters,
  handleLanguageChange,
  handleEducationChange,
  handleExperienceRangeChange,
  educationOptions,
  availableLanguages,
  education,
  experienceRange,
  disabled,
  isSubmitted,
  isLoading,
}) => {
  // const { userSettings, setUserSettings } = useUserSettings();
  // const [profileData, setProfileData] = useState({ // profileData 관련된 부분도 일단 주석처리합니다. userSettings가 없으면 의미가 없을 수 있습니다.
  //   username: '',
  //   email: '',
  //   language: 'en',
  //   // ... other fields
  //   // filename: userSettings?.filename // userSettings를 사용하던 부분
  // });
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const { resumeLabel, labelVectorize, updateResumeToUser } = useResumeUpload();

  // useEffect(() => { // userSettings를 사용하므로 주석 처리
  //   if (userSettings) {
  //     setProfileData({
  //       username: userSettings.username || '',
  //       email: userSettings.email || '',
  //       language: userSettings.language || 'en',
  //       // ... other fields
  //       filename: userSettings.filename
  //     });
  //   }
  // }, [userSettings]);

  const handleFileUpload = async () => {
    if (selectedFile) {
      setResumeLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        // const user_id = userSettings?.user_id; // userSettings를 사용하던 부분
        const user_id = "temp_user_id"; // 임시 ID 사용 또는 이 기능 전체 주석 처리 필요

        if (!user_id) {
          console.error("User ID not found. Cannot upload resume.");
          setResumeLoading(false);
          return;
        }

        const labeledData = await resumeLabel(formData);
        const vectorizedData = await labelVectorize(labeledData);
        let update_dto = { ...labeledData, ...vectorizedData, file_name: selectedFile.name };
        await updateResumeToUser(user_id, update_dto);

        // setUserSettings(prevSettings => ({ // setUserSettings를 사용하므로 주석 처리
        //   ...prevSettings,
        //   filename: selectedFile.name,
        // }));
        // setProfileData(prevData => ({ // profileData도 주석 처리했으므로 관련 로직 주석 처리
        //   ...prevData,
        //   filename: selectedFile.name,
        // }));
        console.log("File upload successful, new filename:", selectedFile.name);

      } catch (err) {
        console.error(err);
      } finally {
        setResumeLoading(false);
        setSelectedFile(null);
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: isSubmitted,
  });

  const handleFileDelete = () => {
    if (!isSubmitted) {
      setSelectedFile(null);
    }
  };

  // const handleSubmit = async (event) => { // userSettings를 사용하므로 주석 처리
  //   event.preventDefault();
  //   if (setUserSettings) {
  //     setUserSettings(prevSettings => ({ ...prevSettings, ...profileData }));
  //   }
  //   // API call to update user settings on the backend
  //   console.log('Updated profile data:', profileData);
  // };

  // if (!userSettings && !isLoading) { // userSettings를 사용하므로 주석 처리 (조건부 렌더링)
  //   return <div>Loading user settings or settings not available...</div>;
  // }


  const selectSections = [
    {
      title: 'Language Preferences',
      description: 'Choose the languages you are comfortable working in.',
      value: availableLanguages && filters.languages ? filters.languages.map((lang) => ({ value: lang, label: lang })) : [],
      options: availableLanguages ? availableLanguages.map((lang) => ({ value: lang, label: lang })) : [],
      onChange: handleLanguageChange,
      disabled,
      isMulti: true,
      isClearable: false,
    },
    {
      title: 'Education Level',
      description: 'Choose the minimum required education level for job listings.',
      isLoading,
      value: educationOptions && education ? educationOptions.find((option) => option.value === education) : null,
      options: educationOptions,
      onChange: handleEducationChange,
      disabled,
      isClearable: true,
    },
  ];
  return (
    <div>
      {/* <Header isLoading={isLoading} userProfile={userSettings?.picture} /> */}
      <Header isLoading={isLoading} userProfile={undefined /* userSettings?.picture 대신 undefined */} />
      <div className={`user-profile ${disabled ? 'disabled' : ''}`}>
        <div className="backend-section container-padding setting-box">
          {/* Select Sections */}
          {selectSections.map((section, index) => (
            <SelectSection
              isLoading={isLoading}
              key={index}
              title={section.title}
              description={section.description}
              {...section}
            />
          ))}

          {/* Experience Range */}
          <div className="backend-filter-with-description">
            <div className="backend-description">
              <h3>Experience Range</h3>
              <p>Adjust the slider to set the experience range for job listings.</p>
            </div>
            <div className="backend-filter-item">
              <div className="backend-slider-wrapper">
                <Slider
                  value={experienceRange}
                  onChange={handleExperienceRangeChange}
                  min={0}
                  max={15}
                  valueLabelDisplay="auto"
                  disabled={disabled || !education}
                />
              </div>
              <div className="backend-slider-labels">
                <span>
                  {experienceRange[0]} - {experienceRange[1]} years
                </span>
              </div>
            </div>
          </div>
          {/* Resume Upload : might need to seperate*/}
          <div className="backend-filter-with-description">
            <div className="backend-description">
              <h3>Resume</h3>
              <p>Upload your resume.</p>
              {/* {userSettings?.filename && ( // userSettings를 사용하던 부분
                <p style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: '#666' }}>Uploaded file:</span>
                  <span style={{ color: '#00ff00', fontWeight: 500 }}> {userSettings.filename}</span>
                </p>
              )} */}
            </div>
            <div className="backend-filter-item">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                {selectedFile ? (
                  <>
                    <span>{selectedFile.name}</span>
                    <div>
                      <IconButton
                        onClick={handleFileDelete}
                        aria-label="delete"
                        size="small"
                        disabled={isSubmitted || resumeLoading}
                      >
                        <CloseIcon />
                      </IconButton>
                      {resumeLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFileUpload}
                          sx={{
                            fontSize: '0.8rem',
                          }}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div {...getRootProps()} style={{ width: '100%' }}>
                    <input
                      {...getInputProps()}
                      id="fileUploadInput"
                      style={{ display: 'none' }}
                      disabled={isSubmitted}
                    />
                    <Button disabled={disabled || isSubmitted} style={{ width: '100%' }}>
                      Upload File
                    </Button>
                  </div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
