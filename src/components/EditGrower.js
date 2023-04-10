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
  Typography,
} from '@material-ui/core';
import ImageScroller from './ImageScroller';
import SelectOrg from './common/SelectOrg';
import { GrowerContext } from 'context/GrowerContext';
import { ORGANIZATION_NOT_SET } from 'models/Filter';

const useStyle = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0, 4),
  },
  textContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    gap: theme.spacing(2),
  },
  textInput: {
    margin: theme.spacing(2, 0),
    flex: 1,
  },
  typography: {
    margin: theme.spacing(2, 0),
  },
  span: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  warning: {
    color: 'red',
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
  const [customImageUrl, setCustomImageUrl] = useState(null);
  const [customImageUrlError, setCustomImageUrlError] = useState({
    label: '',
    error: false,
  });
  const regex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  useEffect(() => {
    async function loadGrowerImages() {
      if (grower?.id) {
        setLoadingGrowerImages(true);
        const selfies = await growerContext.getGrowerSelfies(grower.id);
        setLoadingGrowerImages(false);
        setGrowerImages([
          customImageUrl === '' ? null : customImageUrl,
          ...(grower.image_url ? [grower.image_url] : []),
          ...(selfies || []).filter((img) => img != grower.image_url),
        ]);
      }
    }
    setCustomImageUrl(null);
    setGrowerUpdate(null);
    loadGrowerImages();
  }, [grower]);
  function isImgURL(url) {
    if (typeof url === 'object') {
      return url === null ? false : regex.test(url.image_url);
    }
    return regex.test(url);
  }
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

  function handleCustomUrlError(url) {
    if (url === '' || isImgURL(url)) {
      setCustomImageUrlError({
        error: false,
        label: '',
      });

      return;
    }
    if (!isImgURL(url)) {
      setCustomImageUrlError({
        error: true,
        label: 'Please insert a valid Image URL',
      });
    }
  }
  function handleCancel() {
    setGrowerUpdate(null);
    setCustomImageUrl(null);
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

  const inputs = [
    [
      {
        attr: 'first_name',
        label: 'First Name',
      },
      {
        attr: 'last_name',
        label: 'Last Name',
      },
    ],
    [
      {
        attr: 'about',
        label: 'About',
        multiline: true,
      },
    ],
  ];

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" maxWidth={false}>
      <DialogTitle id="form-dialog-title">Edit Grower</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.container}>
          <ImageScroller
            images={[
              customImageUrl === '' ? null : customImageUrl,
              ...growerImages,
            ].filter((e) => e !== null)}
            selectedImage={growerUpdate?.image_url || grower.image_url}
            loading={loadingGrowerImages}
            blankMessage="No grower images available"
            imageRotation={
              growerUpdate?.imageRotation || grower.imageRotation || 0
            }
            onSelectChange={handleChange}
          />
          <TextField
            className={classes.textInput}
            label="Image Custom URL"
            helperText={customImageUrlError.label}
            error={customImageUrlError.error}
            onChange={(e) => {
              handleCustomUrlError(e.target.value);
              if (isImgURL(e.target.value)) {
                setCustomImageUrl(e.target.value);
                handleChange('image_url', e.target.value);
              } else setCustomImageUrl(null);
            }}
          />
          {inputs.map((row, rowIdx) => (
            <Grid
              item
              container
              direction="row"
              className={classes.textContainer}
              key={rowIdx}
            >
              {row.map((input, colIdx) => (
                <TextField
                  key={`TextField_${rowIdx}_${colIdx}`}
                  className={classes.textInput}
                  id={input.attr}
                  label={input.label}
                  type={input.type || 'text'}
                  variant="outlined"
                  multiline={input.multiline || undefined}
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

          <Typography variant="body1" className={classes.typography}>
            <span className={classes.span}>Grower-entered organization:</span>{' '}
            {getValue('organization') ? (
              getValue('organization')
            ) : (
              <span className={classes.warning}>No organization entered</span>
            )}
          </Typography>

          <SelectOrg
            orgId={getValue('organization_id')}
            defaultOrgs={[
              {
                id: ORGANIZATION_NOT_SET,
                stakeholder_uuid: ORGANIZATION_NOT_SET,
                name: 'Not set',
                value: null,
              },
            ]}
            handleSelection={(org) => {
              handleChange('organization_id', org?.id || null);
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
