import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Grid,
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
  const classes = useStyles();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
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
          <StakeholderDialogHeader data={rowData} />

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
