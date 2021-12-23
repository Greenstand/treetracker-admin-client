import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
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
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '60vh',
    width: '100vw',
  },
  tall: {
    height: 300,
  },
});

function LinkStakeholder({ id, type }) {
  const classes = useStyles();
  const {
    isLoading,
    unlinkedStakeholders,
    getUnlinkedStakeholders,
  } = useContext(StakeholdersContext);
  const [open, setOpen] = useState(false);
  const [filteredStakeholders, setFilteredStakeholders] = useState(
    unlinkedStakeholders,
  );

  useEffect(() => {
    const abortController = new AbortController();

    getUnlinkedStakeholders(id, { signal: abortController.signal });

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
    setOpen(false);
  };

  const onLinkUpdate = (id) => {
    const stillUnlinked = filteredStakeholders.filter((s) => s.id != id);
    setFilteredStakeholders(stillUnlinked);
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
            {isLoading ? (
              <div className={classes.placeholder}>
                <CircularProgress id="loading" />
              </div>
            ) : (
              filteredStakeholders &&
              filteredStakeholders.map((stakeholder) => {
                return (
                  <StakeholderList
                    key={stakeholder.id}
                    id={id}
                    data={stakeholder}
                    type={type}
                    linked={false}
                    onLinkUpdate={onLinkUpdate}
                  ></StakeholderList>
                );
              })
            )}
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
