import React from "react";
import "./filters.css";
import Select from "react-select";
import { Slider } from "@mui/material";
import useIsMobile from "../../../hooks/useIsMobile";

const CustomSelect = ({ value, options, placeholder, onChange, isMulti = false, isClearable = false, isSearchable = true }) => (
  <Select
    isMulti={isMulti}
    isClearable={isClearable}
    isSearchable={isSearchable}
    value={value}
    options={options}
    classNamePrefix="select"
    placeholder={placeholder}
    onChange={onChange}
    className="custom-placeholder"
  />
);

const computeOptions = (availableOptions) =>
  availableOptions
    ? availableOptions
        .filter(Boolean)
        .map((option) => ({ value: option, label: option }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

function Filters({
  handleLanguageChange,
  handleEducationChange,
  handleExperienceRangeChange,
  education,
  educationOptions,
  availableLanguages,
  experienceRange,
  handleFilterChange,
  filter,
}) {
  const isMobile = useIsMobile();
  const languageOptions = computeOptions(availableLanguages);

  return (
    <div className="filters-container">
      <div className="filter-row">
        <div className="filter-item">
          <CustomSelect
            isMulti
            options={languageOptions}
            placeholder="Filter by required languages..."
            onChange={handleLanguageChange}
            isSearchable={!isMobile}
          />
        </div>
        <div className="filter-item">
          <CustomSelect
            isClearable
            value={educationOptions.find(option => option.value === education)}
            options={educationOptions}
            placeholder="Filter by required education..."
            onChange={handleEducationChange}
            isSearchable={!isMobile}
          />
        </div>
        <div className="filter-item slider-container">
          <div className="slider-content">
            <div className="slider-label range-title">
              Set required work experience
            </div>
            <div className="slider">
              <Slider
                value={experienceRange}
                onChange={handleExperienceRangeChange}
                min={0}
                max={15}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                disabled={!education}
              />
            </div>
            <div className="slider-labels">
              <span>
                {experienceRange[0]} - {experienceRange[1]} years
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;