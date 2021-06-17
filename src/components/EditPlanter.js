import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import api from '../api/planters';
import ImageScroller from './ImageScroller';
import { AppContext } from '../context/AppContext';
import { PlanterContext } from '../context/PlanterContext';

const useStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: theme.spacing(0, 4),
  },
  textInput: {
    margin: theme.spacing(2, 1),
    flexGrow: 1,
  },
}));

const EditPlanter = (props) => {
  // console.log('render: edit planter');
  const classes = useStyle();
  const { isOpen, planter, onClose } = props;
  const appContext = useContext(AppContext);
  const planterContext = useContext(PlanterContext);
  const [planterImages, setPlanterImages] = useState([]);
  const [planterUpdate, setPlanterUpdate] = useState(null);
  const [loadingPlanterImages, setLoadingPlanterImages] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);

  useEffect(() => {
    async function loadPlanterImages() {
      if (planter?.id) {
        setLoadingPlanterImages(true);
        const selfies = await api.getPlanterSelfies(planter.id);
        setLoadingPlanterImages(false);

        setPlanterImages([
          ...(planter.imageUrl ? [planter.imageUrl] : []),
          ...selfies.filter((img) => img !== planter.imageUrl),
        ]);
      }
    }

    setPlanterUpdate(null);
    loadPlanterImages();
  }, [planter]);

  async function updatePlanter(planter) {
    await api.updatePlanter(planter);
    const updatedPlanter = await api.getPlanter(planter.id);
    // only update context if planters have already been downloaded
    if (planterContext.planters.length) {
      const index = planterContext.planters.findIndex(
        (p) => p.id === updatedPlanter.id,
      );
      if (index >= 0) {
        // planterContext.setPlanters([
        //   ...planterContext.planters,
        //   { [index]: updatedPlanter },
        // ]);
        planterContext.set({
          planters: [...planterContext.planters, { [index]: updatedPlanter }],
        });
      }
    }
  }

  async function handleSave() {
    if (planterUpdate) {
      setSaveInProgress(true);
      // TODO handle errors
      await updatePlanter({
        id: planter.id,
        ...planterUpdate,
      });
      setSaveInProgress(false);
    }
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  function handleChange(key, val) {
    let newPlanter = { ...planterUpdate };
    newPlanter[key] = val;

    const changed = Object.keys(newPlanter).some((key) => {
      return newPlanter[key] !== planter[key];
    });

    if (changed) {
      setPlanterUpdate(newPlanter);
    } else {
      setPlanterUpdate(null);
    }
  }

  function getValue(attr) {
    // Ensure empty strings are not overlooked
    if (planterUpdate?.[attr] != null) {
      return planterUpdate[attr];
    } else if (planter[attr] != null) {
      return planter[attr];
    }
    return '';
  }

  const inputs = [
    [
      {
        attr: 'firstName',
        label: 'First Name',
      },
      {
        attr: 'lastName',
        label: 'Last Name',
      },
    ],
    [
      {
        attr: 'email',
        label: 'Email Address',
        type: 'email',
      },
    ],
    [
      {
        attr: 'phone',
        label: 'Phone Number',
        type: 'tel',
      },
    ],
  ];

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" maxWidth={false}>
      <DialogTitle id="form-dialog-title">Edit Planter</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.container}>
          <ImageScroller
            images={planterImages}
            selectedImage={planterUpdate?.imageUrl || planter.imageUrl}
            loading={loadingPlanterImages}
            blankMessage="No planter images available"
            imageRotation={
              planterUpdate?.imageRotation || planter.imageRotation || 0
            }
            onSelectChange={handleChange}
          />
          {inputs.map((row, rowIdx) => (
            <Grid item container direction="row" key={rowIdx}>
              {row.map((input, colIdx) => (
                <TextField
                  key={`${rowIdx}_${colIdx}`}
                  className={classes.textInput}
                  id={input.attr}
                  label={input.label}
                  type={input.type || 'text'}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    handleChange(input.attr, e.target.value);
                  }}
                  value={getValue(input.attr)}
                />
              ))}
            </Grid>
          ))}
          <Grid item container>
            {!appContext.userHasOrg && (
              <TextField
                select
                className={classes.textInput}
                label="Organization"
                value={getValue('organizationId')}
                onChange={(e) => {
                  handleChange('organizationId', e.target.value);
                }}
              >
                <MenuItem key={'null'} value={'null'}>
                  No organization
                </MenuItem>
                {appContext.orgList.length &&
                  appContext.orgList.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          id="save"
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!planterUpdate || saveInProgress}
        >
          {saveInProgress ? <CircularProgress size={21} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanter;
