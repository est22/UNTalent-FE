// TypesenseSearch.js

import React, { useState } from 'react';
import { useTypesenseSearch } from '../../../hooks/useTypesenseSearch'; // Adjust the import path as ne

const TypesenseSearch = ({ setIsTypesenseSearch, handleSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInTypesense = useTypesenseSearch(setIsTypesenseSearch, handleSearchResults);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchInTypesense(value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleInputChange}
      placeholder="Search for jobs..."
      className="search-bar"
    />
  );
};

export default TypesenseSearch;
