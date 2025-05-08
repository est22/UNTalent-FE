import { useState, useEffect } from 'react';
import { callApi } from '../utils/apiHandler';

export const useJobData = () => {
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState([]);
  const [agency, setAgency] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [continents, setContinents] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  useEffect(() => {
    // Use the environment-specific API URL from the environment variables
    const fetchJobData = async () => {
      try {
        const res = await callApi.get('/jobs');

        // Parse the languages string into an array and flatten the array of arrays
        const allLanguages = res.data?.flatMap((job) =>
          job.languages ? job.languages.split(', ').filter((lang) => lang.trim() !== '') : []
        );
        const uniqueLanguages = [...new Set(allLanguages)];

        const uniqueContinents = [...new Set(res.data.map((job) => job['duty_continent']))];
        const uniqueCountries = [...new Set(res.data.map((job) => job['duty_country']))];
        const uniqueAgency = [...new Set(res.data.map((job) => job['short_agency']))];

        setAgency(uniqueAgency);
        setJobData(res.data);
        setAvailableCountries(uniqueCountries);
        setAvailableLanguages(uniqueLanguages);
        setContinents(uniqueContinents);
      } catch (error) {
        console.error('Failed to fetch job data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, []);

  return {
    loading,
    jobData,
    agency,
    availableLanguages,
    continents,
    availableCountries,
    setJobData,
    setAvailableCountries,
  };
};
