import React, { useEffect, useState } from 'react';
import JobListings from './JobListings';
import ListingSort from './ListingSort'; // Import the ListingSort component
import './JobList.css';
import useIsMobile from '../../../hooks/useIsMobile';
import Loading from '../../Loading';

const JobList = ({ jobs, scores, isTypesenseSearch, handleSortChange, sortOption, scoresAvailable }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 20;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const isMobile = useIsMobile()

  const renderJobCountDisplay = () => {
    if (isMobile) {
      return `Currently ${jobs.length} jobs`;
    }
    if (isTypesenseSearch && jobs.length >= 100) {
      return `Currently showing the top ${jobs.length} matching jobs`;
    }
    return `Currently showing ${jobs.length} jobs`;
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when the jobs list changes
  }, [jobs]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [currentPage]);

  const handleClickPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPageButtons = () => {
    let pageButtons = [];
    let startPage, endPage;
    const pageLimit = isMobile ? 5 : 10;

    if (totalPages <= pageLimit) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.floor(pageLimit / 2)) {
        startPage = 1;
        endPage = pageLimit;
      } else if (currentPage + Math.floor(pageLimit / 2) <= totalPages) {
        startPage = currentPage - Math.floor(pageLimit / 2);
        endPage = startPage + pageLimit - 1;
      } else {
        endPage = totalPages;
        startPage = totalPages - pageLimit + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handleClickPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div>
      <div className="JobListHeader">
        <div className="JobCountDisplay">
          {renderJobCountDisplay()}
        </div>
        <ListingSort
          handleSortChange={handleSortChange}
          sortOption={sortOption}
          scoresAvailable={scoresAvailable}
        />
      </div>
      <div className="JobListContainer">
        {currentJobs.map((job, index) => (
          <JobListings key={index} job={job} scores={scores} />
        ))}
      </div>
      {!isLoading && (
        <div className="PaginationContainer">
          <button
            disabled={currentPage === 1}
            onClick={() => handleClickPage(currentPage - 1)}
          >
            Prev
          </button>
          {renderPageButtons()}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handleClickPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

export default JobList;
