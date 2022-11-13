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
} from '@material-ui/core';
import ImageScroller from './ImageScroller';
import SelectOrg from './common/SelectOrg';
import { GrowerContext } from 'context/GrowerContext';
import { ORGANIZATION_NOT_SET } from 'models/Filter';

const inputs = [
  {
    attr: 'firstName',
    label: 'First Name',
  },
  {
    attr: 'lastName',
    label: 'Last Name',
  },
];

const useStyle = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0, 4),
  },
  textContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
  },
  textInput: {
    margin: theme.spacing(2, 0),
    flex: '0 0 49%',
  },
}));

const EditGrower = (props) => {
  const classes = useStyle();
  const { isOpen, grower, onClose } = props;
  const growerContext = useContext(GrowerContext);
  const [growerImages, setGrowerImages] = useState([]);
  const [growerUpdate, setGrowerUpdate] = useState(null);
  const [loadingGrowerImages, setLoadingGrowerImages] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);

  useEffect(() => {
    async function loadGrowerImages() {
      if (grower?.id) {
        setLoadingGrowerImages(true);
        const selfies = await growerContext.getGrowerSelfies(grower.id);
        setLoadingGrowerImages(false);

        setGrowerImages([
          ...(grower.imageUrl ? [grower.imageUrl] : []),
          ...(selfies || []).filter((img) => img !== grower.imageUrl),
        ]);
      }
    }

    setGrowerUpdate(null);
    loadGrowerImages();
  }, [grower]);

  async function handleSave() {
    if (growerUpdate) {
      setSaveInProgress(true);
      // TODO handle errors
      await growerContext.updateGrower({
        id: grower.id,
        ...growerUpdate,
      });
      setSaveInProgress(false);
    }
    onClose();
  }

  function handleCancel() {
    setGrowerUpdate(null);
    onClose();
  }

  function handleChange(key, val) {
    let newGrower = { ...growerUpdate };
    newGrower[key] = val;

    const changed = Object.keys(newGrower).some((key) => {
      return newGrower[key] !== grower[key];
    });

    changed ? setGrowerUpdate(newGrower) : setGrowerUpdate(null);
  }

  function getValue(attr) {
    // Ensure empty strings are not overlooked
    return growerUpdate?.[attr] ?? grower?.[attr] ?? '';
  }

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" maxWidth={false}>
      <DialogTitle id="form-dialog-title">Edit Grower</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.container}>
          <ImageScroller
            images={growerImages}
            selectedImage={growerUpdate?.imageUrl || grower.imageUrl}
            loading={loadingGrowerImages}
            blankMessage="No grower images available"
            imageRotation={
              growerUpdate?.imageRotation || grower.imageRotation || 0
            }
            onSelectChange={handleChange}
          />

          <Grid className={classes.textContainer}>
            {inputs.map((input, colIdx) => (
              <TextField
                key={`TextField_${colIdx}`}
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

          <TextField
            className={classes.textInput}
            label="Grower-entered organization"
            value={getValue('organization')}
            disabled
          />
          <SelectOrg
            orgId={getValue('organizationId')}
            defaultOrgs={[
              {
                id: ORGANIZATION_NOT_SET,
                stakeholder_uuid: ORGANIZATION_NOT_SET,
                name: 'Not set',
                value: null,
              },
            ]}
            handleSelection={(org) => {
              handleChange('organizationId', org?.id || null);
            }}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          id="save"
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!growerUpdate || saveInProgress}
        >
          {saveInProgress ? <CircularProgress size={21} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGrower;
