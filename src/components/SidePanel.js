import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  Typography,
  FormControlLabel,
  Drawer,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  TextField,
  Checkbox,
  Button, // replace with icons down the line
} from '@material-ui/core';
// import { selectedHighlightColor } from '../common/variables.js';
import Species from './Species';
import CaptureTags from './CaptureTags';
import { VerifyContext } from 'context/VerifyContext';
import { getDistance } from 'geolib';

const SIDE_PANEL_WIDTH = 315;
const CAP_APP_TAG = [
  { value: 'simple_leaf', label: 'Simple leaf' },
  { value: 'complex_leaf', label: 'Complex leaf' },
  { value: 'acacia_like', label: 'Acacia-like' },
  { value: 'conifer', label: 'Conifer' },
  { value: 'fruit', label: 'Fruit' },
  { value: 'mangrove', label: 'Mangrove' },
  { value: 'palm', label: 'Palm' },
  { value: 'timber', label: 'Timber' },
];
const CAP_MORPH_TAG = [
  { value: 'seedling', label: 'Seedling' },
  { value: 'direct_seedling', label: 'Direct seedling' },
  { value: 'fmnr', label: 'Pruned/tied (FMNR)' },
];
const CAP_REJECT_TAG = [
  { value: 'not_tree', label: 'Not a tree' },
  { value: 'unapproved_tree', label: 'Not an approved tree' },
  { value: 'blurry_image', label: 'Blurry image' },
  { value: 'dead', label: 'Dead' },
  { value: 'duplicate_image', label: 'Duplicate photo' },
  { value: 'flag_user', label: 'Flag user!' },
  {
    value: 'needs_contact_or_review',
    label: 'Flag capture for contact/review',
  },
];
const CAP_AGE_TAG = [
  { value: 'new_tree', label: 'New tree(s)' },
  { value: 'over_two_years', label: '> 2 years old' },
];
const DEFAULT_SWITCH_APPROVE = 0;
const DEFAULT_MORPHOLOGY = 'seedling';
const DEFAULT_AGE = 'new_tree';
const DEFAULT_CAPTURE_APPROVAL_TAG = 'simple_leaf';
const DEFAULT_REJECTION_REASON = 'not_tree';

const useStyles = makeStyles((theme) => ({
  sidePanel: {
    width: SIDE_PANEL_WIDTH,
  },
  drawerPaper: {
    width: SIDE_PANEL_WIDTH,
  },
  subtitle: {
    fontSize: '0.8em',
    color: 'rgba(0,0,0,0.5)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  subtitleNum: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'black',
  },
  selectButton: {
    color: theme.palette.primary.lightVery,
    width: '49%',
    marginBottom: theme.spacing(2),
  },
}));

function SidePanel(props) {
  // console.log('render: sidepanel');
  const classes = useStyles(props);
  const verifyContext = useContext(VerifyContext);
  const captureSelected = verifyContext.getCaptureSelectedArr();
  const captureIdSelected = verifyContext.getCaptureSelectedIdArr();
  const [switchApprove, setSwitchApprove] = useState(DEFAULT_SWITCH_APPROVE);
  const [morphology, setMorphology] = useState(DEFAULT_MORPHOLOGY);
  const [age, setAge] = useState(DEFAULT_AGE);
  const [captureApprovalTag, setCaptureApprovalTag] = useState(
    DEFAULT_CAPTURE_APPROVAL_TAG
  );
  const [rejectionReason, setRejectionReason] = useState(
    DEFAULT_REJECTION_REASON
  );
  const [rememberSelection, setRememberSelection] = useState(false);

  function resetSelection() {
    setSwitchApprove(DEFAULT_SWITCH_APPROVE);
    setMorphology(DEFAULT_MORPHOLOGY);
    setAge(DEFAULT_AGE);
    setCaptureApprovalTag(DEFAULT_CAPTURE_APPROVAL_TAG);
    setRejectionReason(DEFAULT_REJECTION_REASON);
  }

  function setAllSelectedCaptures(value) {
    if (value) {
      let capturesSelectionMap = {};
      verifyContext.captureImages.forEach((capture) => {
        capturesSelectionMap[capture.id] = value;
      });
      verifyContext.setCaptureImagesSelected(capturesSelectionMap);
    } else {
      verifyContext.setCaptureImagesSelected({});
    }
  }

  function calculateLatLonDistance(capture1Id, capture2Id) {
    let obj1 = verifyContext.captureImages.filter(
      (capture) => capture.id == capture1Id
    )[0];
    let obj2 = verifyContext.captureImages.filter(
      (capture) => capture.id == capture2Id
    )[0];
    const distance = getDistance(
      {
        latitude: Number(obj1.lat),
        longitude: Number(obj1.lon),
      },
      {
        latitude: Number(obj2.lat),
        longitude: Number(obj2.lon),
      }
    );
    return `Distance bewteen selected captures: ${(
      Math.round(distance * 10) / 10
    ).toLocaleString()}m`;
  }

  async function handleSubmit() {
    const approveAction =
      switchApprove === 0
        ? {
            isApproved: true,
            morphology,
            age,
            captureApprovalTag,
            rememberSelection,
          }
        : {
            isApproved: false,
            rejectionReason,
            rememberSelection,
          };
    await props.onSubmit(approveAction);
    if (!rememberSelection) {
      resetSelection();
    }
  }

  const radioPrototype = (item, fn) => {
    return (
      <FormControlLabel
        value={item.value}
        onClick={() => {
          fn(item.value);
        }}
        control={<Radio />}
        label={item.label}
        key={item.value}
      />
    );
  };

  const captureApprovalTags = CAP_APP_TAG.map((tag) => {
    return radioPrototype(tag, setCaptureApprovalTag);
  });

  const captureMorphologyTags = CAP_MORPH_TAG.map((tag) => {
    return radioPrototype(tag, setMorphology);
  });

  const captureRejectionTags = CAP_REJECT_TAG.map((tag) => {
    return radioPrototype(tag, setRejectionReason);
  });

  const captureAgeTags = CAP_AGE_TAG.map((tag) => {
    return radioPrototype(tag, setAge);
  });

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      className={classes.sidePanel}
      classes={{
        paper: classes.drawerPaper,
      }}
      elevation={11}
    >
      <Box display="flex" flexDirection="column" flexWrap="nowrap" p={2}>
        <Typography variant="h6">Selected Captures</Typography>
        <Typography className={classes.subtitle}>
          Quantity of selected Captures:{' '}
          <span className={classes.subtitleNum}>
            {(captureSelected && captureSelected.length) || 0}/
            {verifyContext.captureImages.length}
          </span>
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Button
            color="primary"
            variant="contained"
            className={classes.selectButton}
            onClick={() => setAllSelectedCaptures(true)}
          >
            Select All
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.selectButton}
            onClick={() => setAllSelectedCaptures(false)}
          >
            Select None
          </Button>
        </Box>
        <Typography className={classes.subtitle}>
          {captureIdSelected?.length == 2 &&
            calculateLatLonDistance(captureIdSelected[0], captureIdSelected[1])}
        </Typography>
        <Divider />

        <Box mt={1}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={switchApprove}
          >
            <Tab
              label="APPROVE"
              id="full-width-tab-0"
              aria-controls="full-width-tabpanel-0"
              onClick={() => setSwitchApprove(0)}
            />
            <Tab
              label="REJECT"
              id="full-width-tab-1"
              aria-controls="full-width-tabpanel-0"
              onClick={() => setSwitchApprove(1)}
            />
          </Tabs>
          {switchApprove === 0 && (
            <>
              <Box mt={1}>
                <Typography variant="h6">Morphology</Typography>
                <Box mt={1}>
                  <RadioGroup value={morphology}>
                    {captureMorphologyTags}
                  </RadioGroup>
                </Box>
              </Box>
              <Divider />

              <Box mt={1}>
                <Typography variant="h6">Age</Typography>
                <Box mt={1}>
                  <RadioGroup value={age}>{captureAgeTags}</RadioGroup>
                </Box>
              </Box>
              <Divider />

              {/*
                <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
                  <RadioGroup style={{ flexDirection: 'row' }}>
                    <FormControlLabel disabled value='Create token' control={<Radio/>} label='Create token' />
                    <FormControlLabel disabled value='No token' control={<Radio/>} label='No token' />
                  </RadioGroup>
                </Grid>
              */}

              <Box mt={1}>
                <Typography variant="h6">Species (if known)</Typography>
                <Box mt={1}>
                  <Species />
                </Box>
              </Box>

              <Box mt={1}>
                <Typography variant="h6">Additional tags</Typography>
                <Box mt={1}>
                  <CaptureTags placeholder="Add other text tags" />
                  <Box mt={4}>
                    <RadioGroup value={captureApprovalTag}>
                      {captureApprovalTags}
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            </>
          )}
          {switchApprove === 1 && (
            <>
              <Box mt={1}>
                <RadioGroup value={rejectionReason}>
                  {captureRejectionTags}
                </RadioGroup>
              </Box>

              <Box mt={1} mb={6}>
                <Typography variant="h6">Additional tags</Typography>
                <Box mt={1}>
                  <CaptureTags placeholder="Add other text tags" />
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Divider />

        {/*Hidden until functionality is implemented. Issuer: https://github.com/Greenstand/treetracker-admin/issues/371*/}
        {false && (
          <Box mt={1}>
            <TextField placeholder="Note (optional)"></TextField>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!props.submitEnabled}
            style={{ width: '40%' }}
          >
            SUBMIT
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberSelection}
                onChange={(event) => setRememberSelection(event.target.checked)}
                name="remember"
                color="secondary"
              />
            }
            label="Remember selection"
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default SidePanel;
