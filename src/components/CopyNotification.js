import React from "react";
import { Snackbar } from "@material-ui/core"
import { IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const CopyNotification = (props) => {
  const { snackbarLabel, snackbarOpen, setSnackbarOpen } = props;

  function handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }

  return (
    <>
      <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          key={snackbarLabel.length ? snackbarLabel : undefined}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={`${snackbarLabel} copied to clipboard`}
          color="primary"
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
    </>
  )
}

export default CopyNotification;