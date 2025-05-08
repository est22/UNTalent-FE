import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Countdown from 'react-countdown';
import './JobListings.css';
import { educationOptions, getLogoFilenames } from '../../../utils/constants';
import useIsMobile from '../../../hooks/useIsMobile';

const avaliableLogos = new Set(getLogoFilenames())
const defaultLogo = `${process.env.PUBLIC_URL}/logo/UN.png`

const JobListings = ({ job, scores }) => {
  const [agencyLogo, setAgencyLogo] = useState(defaultLogo);
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const logoFilename = job.short_agency ? `${job.short_agency.replace(/\s+/g, '')}.png` : 'UN.png';
    avaliableLogos.has(job.short_agency.replace(/\s+/g, '')) ? setAgencyLogo(`${process.env.PUBLIC_URL}/logo/${logoFilename}`) : setAgencyLogo(defaultLogo)
  }, [job.short_agency]);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const matchingScore = Array.isArray(scores) ? scores.find(score => score.uniquecode === job.uniquecode) : null;
  const overallScore = matchingScore ? matchingScore.score_bert_labels : 0;
  const requiredLanguages = job.languages ? job.languages.split(', ').map(lang => lang.trim()) : [];
  const jobLabels = job.job_labels ? job.job_labels.split(', ') : [];

  const scoreToColor = (score) => {
    const percentage = score * 100;
    const red = percentage < 50 ? 255 : Math.round(256 - (percentage - 50) * 5.12);
    const green = percentage > 50 ? 255 : Math.round((percentage) * 5.12);
    return `rgb(${red}, ${green}, 0)`;
  };

  const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Typography variant="body2">Application closed</Typography>;
    } else {
      return <Typography variant="body2">{days}d {hours}h {minutes}m {seconds}s left</Typography>;
    }
  };

  const countryCode = job['country_code'] ? job['country_code'].toLowerCase() : null;
  const flagUrl = countryCode ? `${process.env.PUBLIC_URL}/flags/${countryCode}.png` : `${process.env.PUBLIC_URL}/flags/globe.png`;
  const postingDate = job['posting_date'] ? new Date(job['posting_date']) : null;
  const applyUntilDate = job['apply_until'] ? job['apply_until'] : null;

  let dutyDisplay = '';
  if (job['duty_station'] && job['duty_country']) {
    dutyDisplay = job['duty_station'] === job['duty_country'] || job['duty_country'] === 'Home-based'
      ? job['duty_country']
      : `${job['duty_station']} (${job['duty_country']})`;
  }

  const recruitmentType = job['eligible_nationality'] === 'Unknown' ? 'Locally recruited' : job['eligible_nationality'];
  const educationRequirements = educationOptions.filter(option => {
    const value = job[option.value];
    return value && value !== "None" && value !== "null" && value !== null && value !== '0';
  }).map(option => option.label);

  const getEndOfDay = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);

    return date;
  };

  return (
    <Grid item xs={12}>
      <Card className="JobCard">
        <CardContent className="JobCardContent">
          <div className="JobLogoContainer">
            <img 
              src={agencyLogo} 
              alt={job.short_agency || 'United Nations'} 
              className="JobLogo" 
            />
          </div>
          <Box className="JobCard__Details" style={{ flex: 1 }}>
            <Box className="JobCard__Title">
              {overallScore > 0 && (
                <div className="ScoreBadge" style={{ backgroundColor: scoreToColor(overallScore) }}>
                  Likelihood of Match: {Math.round(overallScore * 100)}%
                </div>
              )}
              <a href={job.url || '#'} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Typography variant="h6">{job.title || 'No title available'}</Typography>
              </a>
            </Box>
            <Box display="flex" alignItems="center" className="InfoSection">
              <Box display="flex" alignItems="center">
                <img src={flagUrl} alt={job['duty_country']} className="CountryFlag" />
                <Typography className="DataField">{dutyDisplay}</Typography>
              </Box>
              <Box>
                <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>Agency:</Typography>
                <Typography className="DataField">{job.long_agency || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>Grade:</Typography>
                <Typography className="DataField">{job.up_grade || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>Eligibility:</Typography>
                <Typography className="DataField">{recruitmentType}</Typography>
              </Box>
            </Box>
            {
              (job.department) && (
              <>
              <Box display="flex" style={{ marginBottom: '20px' }}>
                <Typography className="DataField">
                  <Box component="span" sx={{ fontWeight: 600, flexShrink: 0, paddingRight: '5px' }}> Department: </Box>
                  {job.department}
                </Typography>
              </Box>
              </>
            )}
            <Box display="flex" className="RequirementsAndLanguages" flexDirection={isMobile ? 'column' : 'row'}>
              {educationRequirements.length > 0 && (
                <Box className="EducationRequirements" style={{ marginRight: '20px' }}>
                  <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>Education Requirements:</Typography>
                  <Box display="flex" flexWrap="wrap" gap="10px" justifyContent="flex-start" className="RequirementsBox">
                    {educationRequirements.map((requirement, idx) => (
                      <Typography key={idx} className="RequirementBox">{requirement}</Typography>
                    ))}
                  </Box>
                </Box>
              )}
              <Box className="Languages">
                <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>Required Languages:</Typography>
                <Box display="flex" flexWrap="wrap" gap="10px" justifyContent="flex-start" className="LanguagesBox">
                  {requiredLanguages.map((lang, idx) => (
                    <Typography key={idx} className="LanguageBox">{lang}</Typography>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box>
              {jobLabels.length > 0 && (
                isMobile ? (
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={handleToggle}
                      sx={{ marginBottom: '10px' }}
                    >
                      {expanded ? 'Hide Job Labels' : 'Show Job Labels'}
                    </Button>
                    {expanded && (
                      <Box display="flex" flexWrap="wrap" gap="10px" justifyContent="flex-start" className="LabelsBox">
                        {jobLabels.map((label, idx) => (
                          <Typography key={idx} className="LabelBox">
                            {label}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box className="JobLabels">
                    <Typography className="SectionLabel" sx={{ fontWeight: 600, fontSize: 16 }}>
                      Job Labels
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap="10px" justifyContent="flex-start" className="LabelsBox">
                      {jobLabels.map((label, idx) => (
                        <Typography key={idx} className="LabelBox">
                          {label}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )
              )}
            </Box>
            <Box className="AdditionalInfo">
              {postingDate && <Typography variant="body2">Posted {Math.floor((new Date() - postingDate > 0 ? new Date() - postingDate : 0 ) / (1000 * 60 * 60 * 24))} days ago</Typography>}
              {applyUntilDate && <Countdown date={getEndOfDay(applyUntilDate)} renderer={CountdownRenderer} now={() => now}/>}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default JobListings;