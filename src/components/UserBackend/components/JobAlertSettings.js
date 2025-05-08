import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// import { useUserSettings } from '../../../../UserSettingsContext'; // 경로 문제로 주석 처리
import './JobAlertSettings.css';
import JobAlertSettingsIcon from '../../../assets/JobAlertSettingsIcon.png';
import { callApi } from '../../../utils/apiHandler';
import { Box, Grid, Typography } from '@mui/material';
import { Slider } from '@mui/material';

const JobAlertSettings = () => {
  const { user } = useAuth0();
  // const { userSettings, setUserSettings } = useUserSettings(); // 주석 처리
  const [selectedFrequency, setSelectedFrequency] = useState('Once per week');
  const [selectedWeekday, setSelectedWeekday] = useState('Monday');
  const [threshold, setThreshold] = useState(60);
  const [isEditing, setIsEditing] = useState(false);

  const frequencies = ['Once per week', 'Every two weeks', 'Once per month'];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mappingTriggerFre = (fetchedTriggerFrequency) => {
    const defaultValues = {
      frequency: 'Once per week',
      weekday: 'Monday'
    };

    const frequencyMapping = {
      '1': 'Once per week',
      '2': 'Every two weeks',
      '3': 'Once per month'
    };
    if (!fetchedTriggerFrequency) return defaultValues

    if (fetchedTriggerFrequency.includes('.')) {
      const [frequencyCode, weekdayIndex] = fetchedTriggerFrequency.split('.');
      return {
        frequency: frequencyMapping[frequencyCode] || defaultValues.frequency,
        weekday: weekdays[parseInt(weekdayIndex) - 1] || defaultValues.weekday
      };
    } else {
      return {
        frequency: frequencyMapping[fetchedTriggerFrequency] || defaultValues.frequency,
        weekday: defaultValues.weekday
      };
    }
  };
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // const fetchedTriggerFrequency = userSettings.trigger_frequency || '1'; // userSettings 사용 부분 주석 처리
        // const fetchedThreshold = userSettings.threshold || 50; // userSettings 사용 부분 주석 처리
        const fetchedTriggerFrequency = '1'; // 임시 기본값
        const fetchedThreshold = 50; // 임시 기본값
        const { frequency, weekday } = mappingTriggerFre(fetchedTriggerFrequency)
        setSelectedFrequency(frequency)
        setSelectedWeekday(weekday)
        setThreshold(parseInt(fetchedThreshold));
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    // if (user && userSettings) { // userSettings 사용 부분 주석 처리
    if (user) { // userSettings 없이 user만 체크하도록 임시 수정
      fetchSettings();
    }
    // }, [userSettings, user, mappingTriggerFre]); // userSettings 의존성 제거
  }, [user, mappingTriggerFre]);

  const handleJobAlertsChange = async (newSettings) => {
    // const previousSettings = { ...userSettings }; // userSettings 사용 부분 주석 처리
    const previousSettings = { trigger_frequency: '1', threshold: 50 }; // 임시 이전 설정
    const {frequency, weekday } = mappingTriggerFre(previousSettings?.trigger_frequency)
    const previousFrequency = frequency
    const previousWeekday = weekday
    const previousThreshold = parseInt(previousSettings?.threshold);
    try {
      // await callApi.patch(`/user/${userSettings.user_id}/alert`, newSettings, null, true) // userSettings 사용 부분 주석 처리
      console.log("API call to update job alert settings would happen here with:", newSettings, "for user_id that is now unavailable due to userSettings being commented out.");
      // setUserSettings({ // setUserSettings 사용 부분 주석 처리
      //   ...userSettings,
      //   trigger_frequency: newSettings.trigger_frequency,
      //   threshold: newSettings.threshold});
      setIsEditing(false)
    } catch (error) {
      // setUserSettings(previousSettings) // setUserSettings 사용 부분 주석 처리
      setSelectedFrequency(previousFrequency);
      setSelectedWeekday(previousWeekday);
      setThreshold(previousThreshold);
      setIsEditing(false)
      console.error("Error updating job alert settings:", error);
    }
  };

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setThreshold(newValue);
  };

  const handleSubmit = () => {
    let triggerCode = '';

    switch (selectedFrequency) {
        case 'Once per week':
            triggerCode = '1';
            break;
        case 'Every two weeks':
            triggerCode = '2';
            break;
        case 'Once per month':
            triggerCode = '3';
            break;
        default:
            triggerCode = '0';
    }

    if (selectedFrequency === 'Once per week') {
        const weekdayIndex = weekdays.indexOf(selectedWeekday) + 1;
        triggerCode = `${triggerCode}.${weekdayIndex}`;
    }

    const newJobAlertSettings = {
        trigger_frequency: triggerCode,
        threshold: threshold,  // Use the decimal value for the threshold
    };

    handleJobAlertsChange(newJobAlertSettings);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="job-alerts container-padding">
      <div className="header">
        <h2 className="main-heading">Job Alert Settings</h2>
      </div>
      <div className="intro-section">
        <div className="intro-text">
          <p>
            You can set how often you would like to receive notifications on jobs that fit your profile and your chosen filter settings. 
            You can further set how good of a match jobs need to be with your profile for UNTalent to include them into the email notification.
          </p>
        </div>
        <img src={JobAlertSettingsIcon} alt="Job Alert Settings Icon" className="intro-image" />
      </div>
      <div className={`setting-box frequency-section ${isEditing ? '' : 'disabled'}`}>
        <h3>Frequency</h3>
        <p>Choose how often you would like to receive job alerts.</p>
        <div className="btn-group">
          {frequencies.map((frequency) => (
            <button
              disabled={!isEditing}
              className={`frequency-btn ${selectedFrequency === frequency ? 'active' : ''}`}
              onClick={() => setSelectedFrequency(frequency)}
              key={frequency}
            >
              {frequency}
            </button>
          ))}
        </div>
        {selectedFrequency === 'Once per week' && (
          <div className="weekday-section">
            <h3>Weekday</h3>
            <p>Select the weekday on which you would like to receive the alert.</p>
            <div className="btn-group">
              {weekdays.map((day) => (
                <button
                  disabled={!isEditing}
                  className={`weekday-btn ${selectedWeekday === day ? 'active' : ''}`}
                  onClick={() => setSelectedWeekday(day)}
                  key={day}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={`setting-box slider-section ${isEditing ? '' : 'disabled'}`}>
        <h3>Threshold</h3>
        <p>Set a minimum threshold for job matches to be included in the alert.</p>
        <Box sx={{ width: 300 }}>
          <Grid container spacing={2}>
            <Grid item xs>
              <Slider
                disabled={!isEditing}
                min={50}
                max={100}
                value={threshold}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                onChange={handleSliderChange}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {threshold >= 80 ? 'Very likely to match' :
                threshold >= 70 ? 'Somewhat likely to match' :
                'Maybe match'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      <button className="save-button" onClick={isEditing ? handleSubmit : toggleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
};
  
export default JobAlertSettings;
