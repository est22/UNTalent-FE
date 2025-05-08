import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './ListingSort.css';

function ListingSort({ handleSortChange, sortOption, scoresAvailable }) {
  const handleChange = (event) => {
    handleSortChange(event.target.value);
  };

  return (
    <div className="sort-section">
      <FormControl variant="outlined" className="sort-section" sx={{ m: 2, minWidth: 220 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          label="Sort by"
          value={sortOption}
          onChange={handleChange}
          MenuProps={{
            disableScrollLock: true,
            classes: { list: 'custom-select-menu' }
          }}
          sx={{
            backgroundColor: '#fffff',
            '& .MuiSelect-select': {
              backgroundColor: '#fffff',
            }
          }}
        >
          <MenuItem value={"apply_until"}>Expiring Soon</MenuItem>
          <MenuItem value={"posting_date"}>Recently Added</MenuItem>
          {scoresAvailable && <MenuItem value={"score_bert_labels"}>Match Score</MenuItem>}
        </Select>
      </FormControl>
    </div>
  );
}

export default ListingSort;
