import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';

import StakeholderDialogHeader from './Header';
import StakeholderGroups from './Groups';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    paddingRight: 12,
  },
  pl: {
    paddingLeft: 32,
  },
  closeButton: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  my: {
    margin: '16px 0',
  },
  noScroll: {
    overflow: 'hidden',
  },
  textWhite: {
    color: 'white',
  },
  alertText: {
    fontWeight: 'normal',
  }
});

export default function StakeholderDetail({ row, columns, child }) {
  const {
    type,
    org_name,
    first_name,
    last_name,
    image_url,
    email,
    phone,
    website,
    logo_url,
    map,
  } = row;
  const rowData = {
    ...row,
    type: type || '',
    org_name: org_name || '',
    first_name: first_name || '',
    last_name: last_name || '',
    image_url: image_url || '',
    email: email || '',
    phone: phone || '',
    website: website || '',
    logo_url: logo_url || '',
    map: map || '',
  };

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const classes = useStyles();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    if (isEditing) {
      setShowAlert(true);
      return;
    }
    setOpen(false);
  };

  const AlertEditingDialog = () => {

    const handleYes = () => {
      setShowAlert(false);
      setIsEditing(false);
      setOpen(false);
    }
  
    return (
      showAlert && <Dialog
          open={showAlert}
          onClose={() => setShowAlert(false)}
        >
          <DialogContent>
            <Typography variant="h6" className={classes.alertText}>
              You have unsaved changes. Close the dialog will clear all the changes.
              Do you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.textWhite}
              onClick={handleYes}
            >
              Yes
            </Button>
            <Button 
              onClick={() => setShowAlert(false)} 
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  return (
    <>
      {/* alert unsaved changes */}
      <AlertEditingDialog />
      {/* Table row */}
      <TableRow hover key={rowData.id} onClick={openModal}>
        {columns.map((col, idx) => (
          <TableCell
            key={col.value}
            className={idx === 0 && child ? classes.pl : ''}
          >
            <div className={classes.flex}>
              {col.value === 'name' && rowData.type === 'Organization' && (
                <>
                  <img
                    src={rowData.logo_url || './logo_192x192.png'}
                    className={classes.logo}
                    alt={rowData.org_name}
                  />
                  {rowData.org_name}
                </>
              )}
              {col.value === 'name' && rowData.type === 'Person' && (
                <>
                  <PersonIcon
                    className={classes.logo}
                    alt={`${rowData.first_name} ${rowData.last_name}`}
                  />
                  {`${rowData.first_name} ${rowData.last_name}`}
                </>
              )}
              {rowData[col.value]}
            </div>
          </TableCell>
        ))}
      </TableRow>

      {/* Dialog with stakeholder details */}
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'lg'}>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          className={classes.closeButton}
          color="secondary"
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className={`${classes.my} ${classes.noScroll}`}>
          <StakeholderDialogHeader 
            data={rowData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

          <Divider className={classes.my} />

          <Grid item container xs={12} spacing={6}>
            <StakeholderGroups
              data={rowData}
              render={['parents', 'children']}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}