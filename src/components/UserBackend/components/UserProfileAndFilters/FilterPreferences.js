import React, { useMemo } from 'react';
import './UserProfile.css';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import SelectSection from './SelectSection';
function FilterPreferences({
  filters,
  handleContinentChange,
  handleCountryChange,
  handleAgencyChange,
  handleUpGradeChange,
  handleRecruitmentOptionChange,
  continents,
  availableCountries,
  groupedCountryOptions,
  agencyOptions,
  upGrades,
  groupedAgencyOptions,
  disabled,
  isLoading
}) {
  const continentOptions = continents || [];
  const countryOptions = useMemo(() => availableCountries || [], [availableCountries]);
  const upGradeOptions = upGrades || [];
  const selectSections = [
    {
      title: 'Continent Filter',
      description: 'Select the continents where you\'re interested in finding jobs.',
      isLoading,
      value: continentOptions.filter(option => filters.continents.includes(option.value)),
      options: continentOptions,
      onChange: handleContinentChange,
      disabled,
      isMulti: true,
      isClearable: false,
    },
    {
      title: 'Country Filter',
      description: 'Select the countries where you\'re interested in finding jobs.',
      isLoading,
      value: countryOptions.filter(option => filters.countries.includes(option.value)),
      options: groupedCountryOptions,
      onChange: handleCountryChange,
      disabled,
      isMulti: true,
      isClearable: false,
    },
    {
      title: 'Agency Filter',
      description: 'Select the agencies that you\'d like to work for.',
      isLoading,
      value: agencyOptions.filter(option => filters.agency.includes(option.value)),
      options: groupedAgencyOptions,
      onChange: handleAgencyChange,
      disabled,
      isMulti: true,
      isClearable: false,
    },
    {
      title: 'Grade Level Filter',
      description: 'Select the grade levels suitable for you.',
      isLoading,
      value: upGradeOptions.filter(option => filters.upGrades.includes(option.value)),
      options: upGradeOptions,
      onChange: handleUpGradeChange,
      disabled,
      isMulti: true,
      isClearable: false,
    }
  ];


  return (
    <div className={`filter-preferences ${disabled ? 'disabled' : ''}`}>
    <div className="backend-section setting-box">
        {/* Select Sections */}
        {selectSections.map((section, index) => (
          <SelectSection
            key={index}
            title={section.title}
            description={section.description}
            {...section}
          />
        ))}

        <div className="backend-filter-with-description">
          <div className="backend-description">
              <h3>Recruitment Options</h3>
            <div>Choose between local and international job options.</div>
          </div>
          <div className="backend-filter-item">
          <ToggleButtonGroup
              value={[
                ...(filters.recruitmentOptions && filters.recruitmentOptions.local ? ['local'] : []),
                ...(filters.recruitmentOptions && filters.recruitmentOptions.international ? ['international'] : []),
              ]}
              onChange={handleRecruitmentOptionChange}
              disabled={disabled}
              aria-label="Recruitment Options"
              className="toggle-button-group unique-toggle-group"  // Add unique class here
            >
              <ToggleButton value="local" aria-label="Show local jobs" disabled={disabled}>Show local jobs</ToggleButton>
              <ToggleButton value="international" aria-label="Show international jobs" disabled={disabled}>Show international jobs</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
    </div>
    </div>
  );
 }  

 export default FilterPreferences;