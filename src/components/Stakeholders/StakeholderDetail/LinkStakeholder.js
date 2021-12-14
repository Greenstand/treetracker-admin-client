import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
} from '@material-ui/core';
import { StakeholdersContext } from 'context/StakeholdersContext';
import StakeholderList from './List';

const useStyles = makeStyles({
  textWhite: {
    color: 'white',
  },
  listBox: {
    marginTop: 12,
    borderRadius: 4,
    height: 112,
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    border: '1px solid rgba(0,0,0,0.1)',
  },
  tall: {
    height: 300,
  },
});

function LinkStakeholder({ id, type }) {
  const classes = useStyles();
  const { unlinkedStakeholders, getUnlinkedStakeholders } = useContext(
    StakeholdersContext,
  );
  const [open, setOpen] = useState(false);
  const [filteredStakeholders, setFilteredStakeholders] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    if (unlinkedStakeholders.length === 0) {
      getUnlinkedStakeholders(id, { signal: abortController.signal });
    }
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    // filter unlinked by the stakeholder type: organization, person so only appropriate types can be linked by relation: parents, children, users, growers
    // need to update db relations table first

    // const filtered = unlinkedStakeholders.filter((s) => {
    //   const relation =
    //     type === 'children' || type === 'parents' ? 'Organization' : 'Person';
    //   return s.type === relation;
    // });

    // setFilteredStakeholders(filtered);
    setFilteredStakeholders(unlinkedStakeholders);
  }, [unlinkedStakeholders]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    // setFilteredStakeholders([]);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="contained"
        color="primary"
        className={classes.textWhite}
      >
        Link {type}
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Link Stakeholder</DialogTitle>
        <DialogContent>
          <List className={`${classes.listBox} ${classes.tall}`}>
            {filteredStakeholders &&
              filteredStakeholders.map((stakeholder) => {
                return (
                  <StakeholderList
                    key={stakeholder.id}
                    id={id}
                    data={stakeholder}
                    type={type}
                    linked={false}
                  ></StakeholderList>
                );
              })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LinkStakeholder;
