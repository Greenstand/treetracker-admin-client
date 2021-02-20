import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
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
} from '@material-ui/core'
import api from '../api/planters'
import ImageScroller from './ImageScroller'
import { getOrganization } from '../api/apiUtils';

const useStyle = makeStyles(theme => ({
  container: {
    position: 'relative',
    padding: theme.spacing(0, 4),
  },
  textInput: {
    margin: theme.spacing(2,1),
    flexGrow: 1,
  },
}));

const EditPlanter = (props) => {
  
  const classes = useStyle()
  const { isOpen, planter, onClose } = props

  const [planterImages, setPlanterImages] = useState([])
  const [planterUpdate, setPlanterUpdate] = useState(null)
  const [loadingPlanterImages, setLoadingPlanterImages] = useState(false)
  const [saveInProgress, setSaveInProgress] = useState(false)

  useEffect(() => {
    props.organizationDispatch.loadOrganizations()
  }, [props.organizationDispatch])

  useEffect(() => {
    async function loadPlanterImages() {
      if (planter?.id) {
        setLoadingPlanterImages(true)
        const selfies = await api.getPlanterSelfies(planter.id)
        setLoadingPlanterImages(false)

        setPlanterImages([
          ...(planter.imageUrl ? [planter.imageUrl] : []),
          ...selfies.filter(img => img !== planter.imageUrl),
        ])
      }
    }

    setPlanterUpdate(null)
    loadPlanterImages()
  }, [planter])

  async function handleSave() {
    if (planterUpdate) {
      setSaveInProgress(true)
      // TODO handle errors
      await props.plantersDispatch.updatePlanter({id: planter.id, ...planterUpdate})
      setSaveInProgress(false)
    }
    onClose()
  }

  function handleCancel() {
    onClose()
  }

  function handleChange(key, val) {
    let newPlanter = {...planterUpdate}
    newPlanter[key] = val

    const changed = Object.keys(newPlanter).some((key) => {
      return newPlanter[key] !== planter[key];
    })

    if (changed) {
      setPlanterUpdate(newPlanter)
    } else {
      setPlanterUpdate(null)
    }
  }

  function handleSelectPlanterImage(img) {
    handleChange('imageUrl', img)
  }

  function getValue(attr) {
    // Ensure empty strings are not overlooked
    if (planterUpdate?.[attr] != null) {
      return planterUpdate[attr]
    } else if (planter[attr] != null) {
      return planter[attr]
    }
    return ''
  }

  const inputs = [[
    {
      attr: 'firstName',
      label: 'First Name',
    },{
      attr: 'lastName',
      label: 'Last Name',
    },
  ],[
    {
      attr: 'email',
      label: 'Email Address',
      type: 'email'
    },
  ],[
    {
      attr: 'phone',
      label: 'Phone Number',
      type: 'tel'
    },
  ]]

  return(
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" maxWidth={false}>
      <DialogTitle id="form-dialog-title">Edit Planter</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.container}>
          <ImageScroller
            images={planterImages}
            selectedImage={planterUpdate?.imageUrl || planter.imageUrl}
            onSelectImage={handleSelectPlanterImage}
            loading={loadingPlanterImages}
            blankMessage="No planter images available"
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
                  onChange={(e) => {handleChange(input.attr, e.target.value)}}
                  value={getValue(input.attr)}
                />
              ))}
            </Grid>
          ))}
          <Grid item container>
            {!getOrganization() && <TextField
                select
                className={classes.textInput}
                label='Organization'
                value={getValue('organizationId')}
                onChange={(e) => {handleChange('organizationId', e.target.value)}}
                >
                {[
                  ...props.organizationState.organizationList
                ].map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button id="save" onClick={handleSave} variant="contained" color="primary"
                disabled={!planterUpdate || saveInProgress}>
          {saveInProgress ? <CircularProgress size={21} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export {EditPlanter}

export default connect(
  (state) => ({
    plantersState: state.planters,
    organizationState: state.organizations,
  }),
  (dispatch) => ({
    plantersDispatch: dispatch.planters,
    organizationDispatch: dispatch.organizations,
  }),
)(EditPlanter)
