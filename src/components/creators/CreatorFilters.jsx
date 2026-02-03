import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CreatorFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortBy,
  onSortChange,
  onClearFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search || '');
  const debouncedSearch = useDebounce(localSearch, 500);

  // Update parent when debounced search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Sync local search with prop
  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  const hasActiveFilters =
    localSearch ||
    status ||
    startDate ||
    endDate ||
    sortBy !== 'createdAt_desc';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          {/* Search Input */}
          <TextField
            placeholder="Search by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: localSearch && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => {
                      setLocalSearch('');
                      onSearchChange('');
                    }}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Clear fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status || ''}
              onChange={(e) => onStatusChange(e.target.value || null)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>

          {/* Start Date */}
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 150 },
              },
            }}
          />

          {/* End Date */}
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 150 },
              },
            }}
          />

          {/* Sort Options */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy || 'createdAt_desc'}
              onChange={(e) => onSortChange(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="createdAt_desc">Newest First</MenuItem>
              <MenuItem value="createdAt_asc">Oldest First</MenuItem>
              <MenuItem value="name_asc">Name (A-Z)</MenuItem>
              <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              <MenuItem value="submissions_desc">Most Submissions</MenuItem>
              <MenuItem value="points_desc">Most Points</MenuItem>
            </Select>
          </FormControl>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onClearFilters}
              size="small"
            >
              Clear Filters
            </Button>
          )}

          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" width="100%">
              {localSearch && (
                <Chip
                  label={`Search: "${localSearch}"`}
                  onDelete={() => {
                    setLocalSearch('');
                    onSearchChange('');
                  }}
                  size="small"
                />
              )}
              {status && (
                <Chip
                  label={`Status: ${status}`}
                  onDelete={() => onStatusChange(null)}
                  size="small"
                />
              )}
              {startDate && (
                <Chip
                  label={`From: ${startDate.toLocaleDateString()}`}
                  onDelete={() => onStartDateChange(null)}
                  size="small"
                />
              )}
              {endDate && (
                <Chip
                  label={`To: ${endDate.toLocaleDateString()}`}
                  onDelete={() => onEndDateChange(null)}
                  size="small"
                />
              )}
              {sortBy !== 'createdAt_desc' && (
                <Chip
                  label={`Sort: ${sortBy}`}
                  onDelete={() => onSortChange('createdAt_desc')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default CreatorFilters;
