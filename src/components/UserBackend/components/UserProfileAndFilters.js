import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './UserProfileAndFilters/UserProfile';
import FilterPreferences from './UserProfileAndFilters/FilterPreferences';
import { educationOptions } from '../../../utils/constants';
import continentsCountriesCities from '../../../libraries/continents_countries_and_cities_final.json';
import gradeNames from '../../../libraries/gradenames.json';
import agencynames from '../../../libraries/agencynames.json';
import { useUserSettings } from '../../../UserSettingsContext';
import { callApi } from '../../../utils/apiHandler';

import './UserProfileAndFilters.css';

const createOptionsFromJSON = (data, keyExtractor, labelExtractor) => {
  return Object.entries(data)
    .map(([key, value]) => ({
      value: keyExtractor(key, value),
      label: labelExtractor(key, value),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const UserProfileAndFilters = () => {
  const { user } = useAuth0();
  const { userSettings, setUserSettings } = useUserSettings();
  const safeSplit = (str) => str ? str.split(',') : [];
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [continentOptions, setContinentOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [resumeFile, /* setResumeFile */] = useState(null);
  const [filters, setFilters] = useState({
    languages: [],
    education: null,
    experienceRange: [0, 15],
    continents: [],
    countries: [],
    agency: [],
    upGrades: [],
    recruitmentOptions: { local: false, international: false }
  });
  const [groupedCountryOptions, setGroupedCountryOptions] = useState([]);
  const [groupedAgencyOptions, setGroupedAgencyOptions] = useState([]);

  useEffect(() => {
    if (userSettings) {
      setFilters({
        languages: safeSplit(userSettings.languages),
        education: userSettings.education || null,
        experienceRange: userSettings.experience_range
          ? userSettings.experience_range.split('-').map(Number)
          : [0, 15],
        continents: safeSplit(userSettings.continents),
        countries: safeSplit(userSettings.countries),
        agency: safeSplit(userSettings.agency),
        upGrades: safeSplit(userSettings.up_grades),
        recruitmentOptions: userSettings.recruitment_options
          ? (typeof userSettings.recruitment_options === 'string'
            ? JSON.parse(userSettings.recruitment_options)
            : userSettings.recruitment_options)
          : { local: false, international: false },
      });
    }
  }, [userSettings]);

  useEffect(() => {
    setIsInitialLoading(true);
    fetch('libraries/language_patterns.json')
      .then((response) => response.json())
      .then((data) => {
        setAvailableLanguages(Object.keys(data));
        setContinentOptions(createOptionsFromJSON(continentsCountriesCities, key => key.trim(), key => key.trim()));

        const localGroupedCountryOptions = Object.entries(continentsCountriesCities).map(([continent, countries]) => ({
          label: continent.trim(),
          options: Object.keys(countries).map(country => ({ value: country.trim(), label: country.trim() })).sort((a, b) => a.label.localeCompare(b.label))
        }));

        setGroupedCountryOptions(localGroupedCountryOptions);

        const flattenedCountryOptions = Object.entries(continentsCountriesCities).flatMap(([continent, countries]) => {
          return Object.keys(countries).map(country => ({ value: country.trim(), label: country.trim() }))
            .sort((a, b) => a.label.localeCompare(b.label));
        });

        setCountryOptions(flattenedCountryOptions);

        const flattenedAgencyOptions = Object.entries(agencynames).flatMap(([group, agencies]) => {
          return Object.entries(agencies)
            .map(([abbr, name]) => ({ value: abbr, label: abbr }))
            .sort((a, b) => a.label.localeCompare(b.label));
        });

        setAgencyOptions(flattenedAgencyOptions);

        const newGroupedAgencyOptions = Object.entries(agencynames).map(([group, agencies]) => ({
          label: group,
          options: Object.entries(agencies)
            .map(([abbr, name]) => ({ value: abbr, label: abbr }))
            .sort((a, b) => a.label.localeCompare(b.label))
        }));

        setGroupedAgencyOptions(newGroupedAgencyOptions);

        setGradeOptions(createOptionsFromJSON(gradeNames, key => key, key => key));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsInitialLoading(false)
      });
  }, []);

  const handleFilterChange = (filterKey) => (selectedOptions) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterKey]: selectedOptions ? selectedOptions.map(opt => opt.value) : [] }));
  };

  const handleLanguageChange = handleFilterChange('languages');
  const handleCountryChange = handleFilterChange('countries');
  const handleAgencyChange = handleFilterChange('agency');
  const handleUpGradeChange = handleFilterChange('upGrades');

  const handleEducationChange = (option) => {
    setFilters(prevFilters => ({ ...prevFilters, education: option ? option.value : null }));
  };

  const handleExperienceRangeChange = (event, newValue) => {
    setFilters(prevFilters => ({ ...prevFilters, experienceRange: newValue }));
  };

  const handleContinentChange = (selectedOptions) => {
    const selectedContinentNames = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFilters(prevFilters => ({ ...prevFilters, continents: selectedContinentNames }));
  };

  const handleRecruitmentOptionChange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      recruitmentOptions: {
        local: newValue.includes('local'),
        international: newValue.includes('international'),
      },
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user.sub) {
      console.error("User or user ID is undefined");
      return;
    }
    // Current data back-up
    const previousSettings = { ...userSettings };
    try {
      const newUserSettings = {
        ...userSettings,
        languages: filters.languages.join(','),
        education: filters.education,
        experience_range: filters.experienceRange.join('-'),
        continents: filters.continents.join(','),
        countries: filters.countries.join(','),
        agency: filters.agency.join(','),
        up_grades: filters.upGrades.join(','),
        recruitment_options: filters.recruitmentOptions,
      };
      setUserSettings(newUserSettings);
      setIsSubmitted(true);

      const payload = new FormData();
      const requestBody = {
        languages: filters.languages.join(','),
        education: filters.education,
        experience_range: filters.experienceRange.join('-'),
        continents: filters.continents.join(','),
        countries: filters.countries.join(','),
        agency: filters.agency.join(','),
        up_grades: filters.upGrades.join(','),
        recruitment_options: JSON.stringify(filters.recruitmentOptions)
      };
      if (resumeFile) {
        payload.append('file', resumeFile, resumeFile.name);
      }
  
      if (resumeFile) {
        payload.append('text', resumeFile.text);
      }
  
      await callApi.patch(`/user/${userSettings.user_id}`,requestBody, null, true)
  
    } catch (error) {
      console.error('An error occurred:', error);
      setUserSettings(previousSettings);
      setIsSubmitted(false);
    }
  };
  
  const handleEditClick = (event) => {
    event.preventDefault();
    setIsSubmitted(false);
  };
  return (
    <div className="user-settings-container">
      <form onSubmit={handleSubmit}>
        <UserProfile
          disabled={isSubmitted}
          filters={filters}
          handleLanguageChange={handleLanguageChange}
          handleEducationChange={handleEducationChange}
          handleExperienceRangeChange={handleExperienceRangeChange}
          educationOptions={educationOptions}
          availableLanguages={availableLanguages}
          education={filters.education}
          experienceRange={filters.experienceRange}
          isSubmitted={isSubmitted}
          isLoading={isInitialLoading}
        />
        <FilterPreferences
          disabled={isSubmitted}
          filters={filters}
          continents={continentOptions}
          availableCountries={countryOptions}
          groupedCountryOptions={groupedCountryOptions}
          agencyOptions={agencyOptions}
          groupedAgencyOptions={groupedAgencyOptions}
          upGrades={gradeOptions}
          recruitmentOptions={filters.recruitmentOptions}
          handleContinentChange={handleContinentChange}
          handleCountryChange={handleCountryChange}
          handleAgencyChange={handleAgencyChange}
          handleUpGradeChange={handleUpGradeChange}
          handleRecruitmentOptionChange={handleRecruitmentOptionChange}
        />
          {isSubmitted ? (
            <button type="button" onClick={handleEditClick} className="custom-button">Edit</button>
          ) : (
            <button type="submit" className="custom-button">Save</button>
          )}
      </form>
    </div>
  );
};

export default UserProfileAndFilters;