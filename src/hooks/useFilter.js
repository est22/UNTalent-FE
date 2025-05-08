import { useState, useEffect } from 'react';
import { educationHierarchy } from '../utils/constants';

export const useFilter = (jobData, setJobData, setAvailableCountries, scores) => {
  const [filter, setFilter] = useState({
    query: '',
    selectedAgency: [],
    education: '',
    experienceRange: [0, 15],
    selectedLanguages: [],
    continent: [],
    selectedCountry: [],
    recruitmentOptions: { local: false, international: false },
    upGrade: '',
  });

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortOption, setSortOption] = useState('apply_until');
  const [typesenseResults, setTypesenseResults] = useState(null);

  const handleSearchResults = (results, isSearchPerformed) => {
    if (isSearchPerformed) {
      if (results && results.length > 0) {
        // Update state to show search results
        setTypesenseResults(results.map(result => result.uniquecode));
      } else {
        // Search was performed but no results found
        setTypesenseResults([]); // or set to null if that represents "no search"
      }
    } else {
      // When search is cleared explicitly reset typesenseResults to indicate no search filter
      setTypesenseResults(null); // Adjust this based on how you wish to represent "no search"
    }
  };

  useEffect(() => {
    // Ensure jobData is an array before proceeding
    if (!Array.isArray(jobData)) return;
    const currentUtcDate = new Date();
    // Function to apply filters besides Typesense search results
    const applyFilters = jobs => jobs.filter(job => {
      const matchesEducation = filter.education 
        ? educationHierarchy[filter.education].some(eduKey => 
            job[eduKey] !== "None" && 
            parseInt(job[eduKey], 10) >= filter.experienceRange[0] && 
            parseInt(job[eduKey], 10) <= filter.experienceRange[1])
        : true;
  
        const jobLanguages = job.languages ? job.languages.split(', ').map(lang => lang.trim()) : [];
        let matchesLanguages = true; // Default to true when no specific language filter is applied
    
        if (filter.selectedLanguages.length > 0 && jobLanguages.length > 0) {
          const commonLanguages = filter.selectedLanguages.filter(lang => jobLanguages.includes(lang));
    
          if (jobLanguages.length === 1) {
            // For jobs requiring exactly one language, user must know that language
            matchesLanguages = commonLanguages.length === 1;
          } else if (jobLanguages.length === 2) {
            // For jobs requiring exactly two languages, user must know both
            matchesLanguages = commonLanguages.length === 2 && jobLanguages.every(lang => filter.selectedLanguages.includes(lang));
          } else {
            // For jobs requiring more than two languages, user must know at least two
            matchesLanguages = commonLanguages.length >= 2;
          }
        } else if (filter.selectedLanguages.length > 0 && jobLanguages.length === 0) {
          // If user has selected languages but job has no language requirements, do not match
          matchesLanguages = false;
        }
  
      const matchesCountry = filter.selectedCountry.length > 0
        ? filter.selectedCountry.includes(job['duty_country'])
        : true;
  
      const matchesUpGrade = filter.upGrade.length > 0
        ? filter.upGrade.includes(job.up_grade)
        : true;
  
      const matchesContinent = filter.continent.length > 0 
        ? filter.continent.includes(job['duty_continent'])
        : true;
  
      const matchesAgency = filter.selectedAgency.length > 0
        ? filter.selectedAgency.includes(job['short_agency'])
        : true;
  
      let matchesRecruitment = true;
      if (filter.recruitmentOptions.local && filter.recruitmentOptions.international) {
        matchesRecruitment = true;
      } else if (filter.recruitmentOptions.local) {
        matchesRecruitment = job['eligible_nationality'] !== 'All';
      } else if (filter.recruitmentOptions.international) {
        matchesRecruitment = job['eligible_nationality'] === 'All';
      }
  
      return matchesEducation && matchesLanguages && matchesCountry && matchesUpGrade && matchesContinent && matchesAgency && matchesRecruitment;
    });
  
    let filteredJobs = [];
  
    // If typesenseResults is null, indicating no search has been performed, or the search has been cleared,
    // apply all filters to the entire job dataset. Otherwise, filter jobData based on typesenseResults first.
    if (typesenseResults === null) {
      filteredJobs = applyFilters(jobData);
    } else if (typesenseResults.length > 0) {
      const jobsMatchingSearch = jobData.filter(job => typesenseResults.includes(job.uniquecode));
      filteredJobs = applyFilters(jobsMatchingSearch);
    } else {
      // If typesenseResults is an empty array, it indicates a search was performed but no results were found.
      // In this case, don't show any jobs unless other filters are applied that could alter this.
      filteredJobs = [];
    }
    const jobSortingHelper = (jobs) => {
      jobs.sort((a, b) => {
        if (sortOption === "apply_until") {
          const dateA = new Date(a[sortOption]);
          const dateB = new Date(b[sortOption]);
          if (!a[sortOption]) return 1; // If a is NULL or empty, move it to the end
          if (!b[sortOption]) return -1; // If b is NULL or empty, move it to the end
          return dateA - dateB
        } else if (sortOption === "posting_date") {
          const dateA = new Date(a[sortOption]);
          const dateB = new Date(b[sortOption]);
          if (!a[sortOption]) return 1; // If a is NULL or empty, move it to the end
          if (!b[sortOption]) return -1; // If b is NULL or empty, move it to the end
          return dateB - dateA
        } else if (Array.isArray(scores)) {
          const scoreA = scores.find(score => score.uniquecode === a.uniquecode)?.[sortOption];
          const scoreB = scores.find(score => score.uniquecode === b.uniquecode)?.[sortOption];
          return (scoreB ?? 0) - (scoreA ?? 0);
        } else {
          return 0; // Default sorting if no criteria match
        }
      });
      return jobs
    }
    let tempFilteredJobs = [];
    let expiredJobs = [];

    filteredJobs.forEach((v) => {
      const currApplyUntil = v['apply_until'] ? new Date(v['apply_until']) : null;
      if (!currApplyUntil || currApplyUntil.getTime() < currentUtcDate.getTime()) {
        expiredJobs.push(v);
      } else {
        tempFilteredJobs.push(v);
      }
    });
    jobSortingHelper(expiredJobs)
    jobSortingHelper(tempFilteredJobs)
    filteredJobs = [...tempFilteredJobs, ...expiredJobs]
    setFilteredJobs(filteredJobs);
  }, [jobData, filter, sortOption, scores, typesenseResults]);
  
  
  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const upGrades = [...new Set(jobData.map(job => job.up_grade))];

  const handleRecruitmentOptionChange = (event, newOptions) => {
    setFilter(prevFilter => ({ 
      ...prevFilter,
      recruitmentOptions: { 
        ...prevFilter.recruitmentOptions,
        local: newOptions.includes('local'),
        international: newOptions.includes('international')
      }
    }));
  };


  const handleFilterChange = (field) => (selectedOptions) => {
    setFilter(prevFilter => ({ 
      ...prevFilter, 
      [field]: Array.isArray(selectedOptions) ? selectedOptions.map(option => option.value || option) : [] 
    }));
  };
  

  const handleContinentChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedValues = selectedOptions.map(option => option.value);
      const newAvailableCountries = jobData
        .filter(job => selectedValues.includes(job['duty_continent']))
        .map(job => job['duty_country']);
      const uniqueNewAvailableCountries = [...new Set(newAvailableCountries)];
      setAvailableCountries(uniqueNewAvailableCountries);
      const newSelectedCountries = filter.selectedCountry.filter(country => uniqueNewAvailableCountries.includes(country));
      setFilter(prevFilter => ({ 
        ...prevFilter, 
        continent: selectedValues, 
        selectedCountry: newSelectedCountries
      }));
    } else {
      // When no continent is selected, populate with all countries
      const allCountries = jobData.map(job => job['duty_country']);
      const uniqueCountries = [...new Set(allCountries)];
      setAvailableCountries(uniqueCountries);
      setFilter(prevFilter => ({ 
        ...prevFilter, 
        continent: [],
        selectedCountry: uniqueCountries
      }));
    }
  };
  

  const handleCountryChange = (selectedOptions) => {
    setFilter(prevFilter => ({ 
      ...prevFilter, 
      selectedCountry: selectedOptions ? selectedOptions.map(option => option.value) : [] 
    }));
  };

  const handleAgencyChange = (selectedOptions) => {
    setFilter(prevFilter => ({ 
      ...prevFilter, 
      selectedAgency: selectedOptions ? selectedOptions.map(option => option.value) : [] 
    }));
  };

  const handleSearch = (e) => {
    setFilter(prevFilter => ({ ...prevFilter, query: e.target.value.toLowerCase() }));
  };

  const handleEducationChange = (selectedOption) => {
    setFilter(prevFilter => ({ ...prevFilter, education: selectedOption ? selectedOption.value : '' }));
  };

  const handleExperienceRangeChange = (event, newValue) => {
    if (newValue[0] < newValue[1]) {
      setFilter(prevFilter => ({ ...prevFilter, experienceRange: newValue }));
    }
  };

  return {
    filter,
    filteredJobs,
    sortOption, 
    handleSearchResults,
    handleSortChange,
    upGrades,
    handleRecruitmentOptionChange,
    handleFilterChange,
    handleContinentChange,
    handleCountryChange,
    handleAgencyChange,
    handleSearch,
    handleEducationChange,
    handleExperienceRangeChange
  };
}