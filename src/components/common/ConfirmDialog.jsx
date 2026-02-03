import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  requireTextMatch = false,
  textToMatch = '',
  showBusinessCount = false,
  businessCount = 0,
  errorMessage = null,
  isLoading = false,
}) => {
  const [matchText, setMatchText] = useState('');

  const handleClose = () => {
    setMatchText('');
    onClose();
  };

  const handleConfirm = () => {
    if (requireTextMatch && matchText !== textToMatch) {
      return;
    }
    setMatchText('');
    onConfirm();
  };

  const canConfirm = !requireTextMatch || matchText === textToMatch;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Typography variant="body1" paragraph>
          {message}
        </Typography>
        {showBusinessCount && businessCount > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This category is currently used by <strong>{businessCount}</strong> business
            {businessCount !== 1 ? 'es' : ''}.
          </Alert>
        )}
        {requireTextMatch && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Type <strong>{textToMatch}</strong> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={matchText}
              onChange={(e) => setMatchText(e.target.value)}
              placeholder={textToMatch}
              variant="outlined"
              size="small"
              error={matchText !== '' && !canConfirm}
              helperText={
                matchText !== '' && !canConfirm
                  ? 'Text does not match'
                  : ''
              }
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color={confirmColor}
          variant="contained"
          disabled={!canConfirm || isLoading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
