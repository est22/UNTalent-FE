import Select from "react-select";
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./FilterSidebar.css";
import useIsMobile from '../../../hooks/useIsMobile';

const computeOptions = (data) => 
  data
    ? data
        .filter(Boolean)
        .map((item) => ({ value: item, label: item }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

const FilterSidebar = ({
  handleContinentChange,
  continents,
  handleCountryChange,
  availableCountries,
  handleAgencyChange,
  agency,
  handleRecruitmentOptionChange,
  recruitmentOptions,
  handleUpGradeChange,
  upGrades, 
}) => {
  
  const continentOptions = computeOptions(continents);
  const countryOptions = computeOptions(availableCountries);
  const agencyOptions = computeOptions(agency);
  const upGradeOptions = computeOptions(upGrades);

  const isMobile = useIsMobile();

  return (
    <div className="sidebar-content">
      <h3 className="filter-heading">Filters</h3>
      <div className="sidebar-filter-item">
        <Select
          isMulti
          isClearable={false}
          name="continents"
          options={continentOptions}
          classNamePrefix="select"
          placeholder="Filter by continent..."
          onChange={handleContinentChange}
          className="custom-placeholder"
          isSearchable={!isMobile}
        />
      </div>
      <div className="sidebar-filter-item">
        <Select
          isMulti
          isClearable={false}
          name="countries"
          options={countryOptions}
          classNamePrefix="select"
          placeholder="Filter by country..."
          onChange={handleCountryChange}
          className="custom-placeholder"
          isSearchable={!isMobile}
        />
      </div>
      <div className="sidebar-filter-item">
        <Select
          isMulti
          isClearable={false}
          name="agency"
          options={agencyOptions}
          classNamePrefix="select"
          placeholder="Filter by agency..."
          onChange={handleAgencyChange}
          className="custom-placeholder"
          isSearchable={!isMobile}
        />
      </div>
      <div className="sidebar-filter-item">
        <Select
          isMulti
          isClearable={false}
          name="upGrade"
          options={upGradeOptions}
          classNamePrefix="select"
          placeholder="Filter by grade..."
          onChange={handleUpGradeChange}
          className="custom-placeholder"
          isSearchable={!isMobile}
        />
      </div>
      <div className="sidebar-filter-item">
        <ToggleButtonGroup
          value={[
            ...(recruitmentOptions.local ? ["local"] : []),
            ...(recruitmentOptions.international ? ["international"] : []),
          ]}
          onChange={handleRecruitmentOptionChange}
          aria-label="Recruitment Options"
          className="toggle-button-group"
          sx={{
            "&.MuiToggleButtonGroup-root": {
              borderRadius: "10px",
            },
          }}
        >
          <ToggleButton
            value="local"
            aria-label="Show local jobs"
            sx={{
              "&.MuiButtonBase-root": {
                border: "none",
              },
            }}
          >
            Show local jobs
          </ToggleButton>
          <ToggleButton
            value="international"
            aria-label="Show international jobs"
            sx={{
              "&.MuiButtonBase-root": {
                border: "none",
              },
            }}
          >
            Show international jobs
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default FilterSidebar;