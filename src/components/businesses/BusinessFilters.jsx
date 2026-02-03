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

const BusinessFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  isVerified,
  onVerificationChange,
  status,
  onStatusChange,
  onClearFilters,
  categories = [],
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
    category ||
    isVerified !== '' ||
    status;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        {/* Search Input */}
        <TextField
          placeholder="Search businesses..."
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

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Verification Status Filter */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Verification</InputLabel>
          <Select
            value={isVerified !== null && isVerified !== '' ? String(isVerified) : ''}
            onChange={(e) => {
              const value = e.target.value;
              onVerificationChange(value === '' ? null : value === 'true');
            }}
            label="Verification"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Verified</MenuItem>
            <MenuItem value="false">Unverified</MenuItem>
          </Select>
        </FormControl>

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
          <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
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
            {category && (
              <Chip
                label={`Category: ${categories.find((c) => c._id === category)?.name || category}`}
                onDelete={() => onCategoryChange(null)}
                size="small"
              />
            )}
            {isVerified !== '' && isVerified !== null && (
              <Chip
                label={`Verification: ${isVerified ? 'Verified' : 'Unverified'}`}
                onDelete={() => onVerificationChange(null)}
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
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BusinessFilters;
