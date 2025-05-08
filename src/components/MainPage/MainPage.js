import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import './MainPage.css';
import FilterSidebar from './components/FilterSidebar';
import Filters from './components/Filters';
import JobList from './components/JobList';
import { useJobData } from '../../hooks/useJobData';
import { useFilter } from '../../hooks/useFilter';
import FileUpload from './components/FileUpload'; 
import ScrollToTop from '../ScrollToTop';
import { educationOptions } from '../../utils/constants';
import useIsMobile from '../../hooks/useIsMobile';
import useTypesenseSearch from '../../hooks/useTypesenseSearch';

function MainPage() {
  const [scores, setScores] = useState(null);
  const [isTypesenseSearch, setIsTypesenseSearch] = useState(false);
  const [showFilters, /* setShowFilters */ ] = useState(false);
  const isMobile = useIsMobile(768);
  const [language, setLanguage] = useState('');
  const [education, setEducation] = useState('');
  const [agency, setAgency] = useState([]);
  const [experience, setExperience] = useState([0, 30]);

  const {
    jobData,
    setJobData,
    availableLanguages,
    continents,
    countries,
    availableCountries,
    setAvailableCountries,
  } = useJobData();

  const {
    filter,
    handleSearchResults,
    handleSortChange,
    upGrades,
    handleRecruitmentOptionChange,
    handleFilterChange,
    handleContinentChange,
    handleCountryChange,
    handleAgencyChange,
    handleEducationChange,
    handleExperienceRangeChange,
    filteredJobs,
    sortOption,
  } = useFilter(jobData, setJobData, setAvailableCountries, scores);

  // Using the custom hook for search
  const [searchTerm, updateSearchTerm] = useTypesenseSearch(handleSearchResults, setIsTypesenseSearch);

  // Update the setScores function to also set the sort option when scores are received
  const handleScoresUpdate = (newScores) => {
    setScores(newScores.data);
    if (newScores.data && newScores.data.length > 0) {
      handleSortChange('score_bert_labels');
    }
  };

  // const handleInputChange = (event) => {
  //   updateSearchTerm(event.target.value);
  // };

  const createHandleFilterChange = (filterName) => handleFilterChange(filterName);
  const { recruitmentOptions, education: filterEducation, selectedCountry, experienceRange } = filter;

  return (
    <div className="app-container">
      <div className="hero-background"></div>
      <Hero updateSearchTerm={updateSearchTerm} searchTerm={searchTerm} isMobile={isMobile} />
      <div className="content-container">
        <div className="sidebar-container">
          {/* {isMobile && (
            <div className="mobile-search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for jobs..."
                className="search-bar"
              />
            </div>
          )} */}
          <FilterSidebar
            handleSearchResults={handleSearchResults}
            setIsTypesenseSearch={setIsTypesenseSearch}
            isMobile={isMobile}
            showFilters={showFilters}
            handleContinentChange={handleContinentChange}
            continents={continents}
            handleCountryChange={handleCountryChange}
            availableCountries={availableCountries}
            handleAgencyChange={handleAgencyChange}
            agency={agency}
            handleRecruitmentOptionChange={handleRecruitmentOptionChange}
            recruitmentOptions={recruitmentOptions}
            handleUpGradeChange={createHandleFilterChange('upGrade')}
            upGrades={upGrades}
          />
        </div>
        <div className="main-content">
          <div className="main-filter-container">
            <Filters
              handleSearch={updateSearchTerm}
              handleSearchResults={handleSearchResults}
              handleEducationChange={handleEducationChange}
              educationOptions={educationOptions}
              education={filterEducation}
              handleExperienceRangeChange={handleExperienceRangeChange}
              handleContinentChange={handleContinentChange}
              handleCountryChange={createHandleFilterChange('selectedCountry')}
              handleLanguageChange={createHandleFilterChange('selectedLanguages')}
              handleAgencyChange={createHandleFilterChange('selectedAgency')}
              availableLanguages={availableLanguages}
              agency={agency}
              continents={continents}
              countries={availableCountries}
              selectedCountry={selectedCountry}
              experienceRange={experienceRange}
            />
            <div className="upload-container">
              <FileUpload onUpload={handleScoresUpdate} />
            </div>  
          </div>
          <div className="joblist-container">
            <JobList
              jobs={filteredJobs}
              scores={scores}
              isTypesenseSearch={isTypesenseSearch}
              handleSortChange={handleSortChange}
              sortOption={sortOption}
              scoresAvailable={scores && scores.length > 0}
            />
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default MainPage;
