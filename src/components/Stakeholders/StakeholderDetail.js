import React, { useState } from 'react';
import {
  Button,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
} from '@material-ui/core';

export default function StakeholderDetail({ row, columns, classes, child }) {
  const [open, setOpen] = useState(false);

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
          <TableCell key={col} className={idx === 0 && child ? classes.pl : ''}>
            {row[col]}
          </TableCell>
        ))}
      </TableRow>

      {/* Dialog with stakeholder details */}
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          <FormControl>
            <TextField
              label="ID"
              variant="outlined"
              name="id"
              // onChange={handleDataChange}
              // value={data?.id || ''}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
