import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const VerifyDialog = ({ open, onClose, onConfirm, business, isLoading = false }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircle color="success" />
          Verify Business
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to verify <strong>{business?.businessName}</strong>? This will allow the business to receive content from creators.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify Business'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyDialog;
