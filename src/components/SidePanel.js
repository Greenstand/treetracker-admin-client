import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'; // replace with icons down the line
// import { selectedHighlightColor } from '../common/variables.js';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Drawer from '@material-ui/core/Drawer';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Species from './Species';
import CaptureTags from './CaptureTags';
import { VerifyContext } from 'context/VerifyContext';

const SIDE_PANEL_WIDTH = 315;

const useStyles = makeStyles((theme) => ({
  sidePanel: {
    width: SIDE_PANEL_WIDTH,
  },
  drawerPaper: {
    width: SIDE_PANEL_WIDTH,
  },
  sidePanelContainer: {
    padding: theme.spacing(2),
    flexWrap: 'nowrap',
  },
  sidePanelItem: {
    marginTop: theme.spacing(1),
  },
  radioGroup: {
    flexDirection: 'row',
  },
  bottomLine: {
    borderBottom: '1px solid lightgray',
  },
  sidePanelSubmitButton: {
    width: '128px',
  },
  subtitle: {
    fontSize: '0.8em',
    color: 'rgba(0,0,0,0.5)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  selectButton: {
    color: theme.palette.primary.lightVery,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function SidePanel(props) {
  // console.log('render: sidepanel');
  const DEFAULT_SWITCH_APPROVE = 0;
  const DEFAULT_MORPHOLOGY = 'seedling';
  const DEFAULT_AGE = 'new_tree';
  const DEFAULT_CAPTURE_APPROVAL_TAG = 'simple_leaf';
  const DEFAULT_REJECTION_REASON = 'not_tree';

  const classes = useStyles(props);
  const verifyContext = useContext(VerifyContext);
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

  function setSelectedCaptures(value) {
    if (value) {
      let captureSelected = {};
      verifyContext.captureImages.forEach((capture) => {
        captureSelected[capture.id] = value;
      });
      verifyContext.setCaptureImagesSelected(captureSelected);
    } else {
      verifyContext.setCaptureImagesSelected({});
    }
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
      <Grid
        container
        direction={'column'}
        className={classes.sidePanelContainer}
      >
        <Grid className={classes.sidePanelItem}>
          <Typography variant="h6">Selected Captures</Typography>
          <Typography className={classes.subtitle}>
            Quantity of selected Captures:{' '}
            {verifyContext.getCaptureSelectedArr().length}/
            {verifyContext.captureImages.length}
          </Typography>
        </Grid>
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <Button
            color="primary"
            variant="contained"
            className={classes.selectButton}
            onClick={() => setSelectedCaptures(true)}
          >
            Select All
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.selectButton}
            onClick={() => setSelectedCaptures(false)}
          >
            Unselect All
          </Button>
        </Grid>
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
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
              id="full-width-tab-0"
              aria-controls="full-width-tabpanel-0"
              onClick={() => setSwitchApprove(1)}
            />
          </Tabs>
          {switchApprove === 0 && (
            <>
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Morphology
                </Typography>
              </Grid>
              <Grid
                className={`${classes.bottomLine} ${classes.sidePanelItem}`}
              >
                <RadioGroup value={morphology} className={classes.radioGroup}>
                  <FormControlLabel
                    value="seedling"
                    onClick={() => setMorphology('seedling')}
                    control={<Radio />}
                    label="Seedling"
                  />
                  <FormControlLabel
                    value="direct_seedling"
                    control={<Radio />}
                    onClick={() => setMorphology('direct_seedling')}
                    label="Direct seeding"
                  />
                  <FormControlLabel
                    onClick={() => setMorphology('fmnr')}
                    value="fmnr"
                    control={<Radio />}
                    label="Pruned/tied (FMNR)"
                  />
                </RadioGroup>
              </Grid>
              <Grid
                className={`${classes.bottomLine} ${classes.sidePanelItem}`}
              >
                <Typography variant="h6">Age</Typography>
                <RadioGroup value={age} className={classes.radioGroup}>
                  <FormControlLabel
                    onClick={() => setAge('new_tree')}
                    value="new_tree"
                    control={<Radio />}
                    label="New tree(s)"
                  />
                  <FormControlLabel
                    onClick={() => setAge('over_two_years')}
                    value="over_two_years"
                    control={<Radio />}
                    label="> 2 years old"
                  />
                </RadioGroup>
              </Grid>
              {/*
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <RadioGroup className={classes.radioGroup}>
            <FormControlLabel disabled value='Create token' control={<Radio/>} label='Create token' />
            <FormControlLabel disabled value='No token' control={<Radio/>} label='No token' />
          </RadioGroup>
        </Grid>
        */}
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Species (if known)
                </Typography>
                <Species />
              </Grid>
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Additional tags
                </Typography>
                <CaptureTags placeholder="Add other text tags" />
                <br />
              </Grid>
              <RadioGroup
                className={classes.sidePanelItem}
                value={captureApprovalTag}
              >
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('simple_leaf')}
                  value="simple_leaf"
                  control={<Radio />}
                  label="Simple leaf"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('complex_leaf')}
                  value="complex_leaf"
                  control={<Radio />}
                  label="Complex leaf"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('acacia_like')}
                  value="acacia_like"
                  control={<Radio />}
                  label="Acacia-like"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('conifer')}
                  value="conifer"
                  control={<Radio />}
                  label="Conifer"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('fruit')}
                  value="fruit"
                  control={<Radio />}
                  label="Fruit"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('mangrove')}
                  value="mangrove"
                  control={<Radio />}
                  label="Mangrove"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('palm')}
                  value="palm"
                  control={<Radio />}
                  label="Palm"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('timber')}
                  value="timber"
                  control={<Radio />}
                  label="Timber"
                />
              </RadioGroup>
            </>
          )}
          {switchApprove === 1 && (
            <>
              <RadioGroup
                className={classes.sidePanelItem}
                value={rejectionReason}
              >
                <FormControlLabel
                  onClick={() => setRejectionReason('not_tree')}
                  value="not_tree"
                  control={<Radio />}
                  label="Not a tree"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('unapproved_tree')}
                  value="unapproved_tree"
                  control={<Radio />}
                  label="Not an approved tree"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('blurry_image')}
                  value="blurry_image"
                  control={<Radio />}
                  label="Blurry photo"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('dead')}
                  value="dead"
                  control={<Radio />}
                  label="Dead"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('duplicate_image')}
                  value="duplicate_image"
                  control={<Radio />}
                  label="Duplicate photo"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('flag_user')}
                  value="flag_user"
                  control={<Radio />}
                  label="Flag user!"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('needs_contact_or_review')}
                  value="needs_contact_or_review"
                  control={<Radio />}
                  label="Flag capture for contact/review"
                />
              </RadioGroup>
              <Grid className={classes.mb}>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Additional tags
                </Typography>
                <CaptureTags placeholder="Add other text tags" />
              </Grid>
            </>
          )}
        </Grid>
        {/*Hidden until functionality is implemented. Issuer: https://github.com/Greenstand/treetracker-admin/issues/371*/}
        {false && (
          <Grid className={`${classes.sidePanelItem}`}>
            <TextField placeholder="Note (optional)"></TextField>
          </Grid>
        )}
        {/* <Grid className={`${classes.sidePanelItem}`}>
        </Grid> */}
        <Grid
          container
          className={`${classes.sidePanelItem}`}
          justify="space-between"
        >
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!props.submitEnabled}
            className={`${classes.sidePanelSubmitButton}`}
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
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default SidePanel;
