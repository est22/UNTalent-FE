import { useState, useCallback, useEffect } from 'react';
import Typesense from 'typesense';

function useTypesenseSearch(handleSearchResults, setIsTypesenseSearch) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debounceDelay = 300; // Milliseconds

  const typesenseClient = new Typesense.Client({
    nodes: [{
      host: process.env.REACT_APP_TYPESENSE_HOST,
      port: process.env.REACT_APP_TYPESENSE_PORT,
      protocol: process.env.REACT_APP_TYPESENSE_PROTOCOL,
    }],
    apiKey: process.env.REACT_APP_TYPESENSE_API_KEY,
  });

  const handleSearch = useCallback(async (searchText) => {
    if (searchText.length === 0) {
      setIsTypesenseSearch(false);
      handleSearchResults(null, false);
    } else {
      setIsTypesenseSearch(true);
      try {
        const response = await typesenseClient.collections('jobs').documents().search({
          q: searchText,
          query_by: 'title,job_labels',
          sort_by: '_text_match:desc',
          per_page: 100
        });
        if (response.hits.length > 0) {
          const searchResults = response.hits.map(hit => hit.document);
          handleSearchResults(searchResults, true);
        } else {
          handleSearchResults([], true);
        }
      } catch (error) {
        console.error('Search error:', error);
        handleSearchResults([], true);
      }
    }
  }, [typesenseClient, setIsTypesenseSearch, handleSearchResults]);

  useEffect(() => {
    if (isTyping) {
      const timeoutId = setTimeout(() => {
        handleSearch(localSearchTerm);
        setIsTyping(false);
      }, debounceDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [localSearchTerm, handleSearch, isTyping]);

  const updateSearchTerm = (newTerm) => {
    setLocalSearchTerm(newTerm);
    setIsTyping(true);
  };

  return [localSearchTerm, updateSearchTerm];
}

export default useTypesenseSearch;