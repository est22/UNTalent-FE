import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Skeleton from '@mui/material/Skeleton';
import { Fade } from '@mui/material';

const SelectWithLoading = ({ isLoading, value, options, onChange, disabled, isMulti = false, isClearable = false }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      if (!isLoading ) {
        setShouldRender(true);
      }
    }, [isLoading]);

    if (!shouldRender) {
        return <Skeleton variant="rectangular" height={40} />;
      }

  return (
    <div style={{ position: 'relative', height: '40px' }}>
    <Fade in={shouldRender} timeout={800}>
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {shouldRender && (
            <Select
              isMulti={isMulti}
              isClearable={isClearable}
              isDisabled={disabled}
              value={value}
              options={options}
              classNamePrefix="select"
              onChange={onChange}
            />
          )}
        </div>
    </Fade>
</div>
  );
};

export default SelectWithLoading;
