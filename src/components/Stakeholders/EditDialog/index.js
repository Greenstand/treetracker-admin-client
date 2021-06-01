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

import DialogHeader from './Header';
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
      <TableRow hover key={row.id} onClick={openModal}>
        {columns.map((col, idx) => (
          <TableCell
            key={col.value}
            className={idx === 0 && child ? classes.pl : ''}
          >
            <div className={classes.flex}>
              {col.value === 'name' && row.logo && (
                <img src={row.logo} className={classes.logo} alt="" />
              )}
              {col.value === 'name' && !row.logo && (
                <PersonIcon className={classes.logo} />
              )}
              {row[col.value]}
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
          <DialogHeader data={row} />

          <Divider className={classes.my} />

          <Grid container xs={12} spacing={6}>
            <StakeholderGroups data={row} render={['parents', 'children']} />
          </Grid>

          <Divider className={classes.my} />

          <Grid container xs={12} spacing={6}>
            <StakeholderGroups data={row} render={['users', 'growers']} tall />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
