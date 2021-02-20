import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import IconClose from '@material-ui/icons/CloseRounded'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FilterModel from '../models/Filter'
import GSInputLabel from './common/InputLabel'
import classNames from 'classnames'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { getDatePickerLocale, getDateFormatLocale, convertDateToDefaultSqlDate } from '../common/locale'

export const FILTER_WIDTH = 330

const styles = (theme) => {
  return {
    root: {},
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      width: FILTER_WIDTH,
      padding: theme.spacing(3, 2, 2, 2),
      /*
       * boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
       * */
    },
    close: {
      color: theme.palette.grey[500],
    },
    dateInput: {
      width: 158,
      fontSize: 14,
    },
    button: {
      marginTop: 5,
    },
  }
}

function Filter(props) {
  const { classes, filter } = props
  const dateStartDefault = null
  const dateEndDefault = null
  const [treeId, setTreeId] = useState(filter.treeId)
  const [planterId, setPlanterId] = useState(filter.planterId)
  const [deviceId, setDeviceId] = useState(filter.deviceId)
  const [planterIdentifier, setPlanterIdentifier] = useState(filter.planterIdentifier)
  const [status, setStatus] = useState(filter.status)
  const [approved, setApproved] = useState(filter.approved)
  const [active, setActive] = useState(filter.active)
  const [dateStart, setDateStart] = useState(filter.dateStart || dateStartDefault)
  const [dateEnd, setDateEnd] = useState(filter.dateEnd || dateEndDefault)

  const handleDateStartChange = (date) => {
    setDateStart(date)
  }

  const handleDateEndChange = (date) => {
    setDateEnd(date)
  }

  const formatDate = (date) => {
    return convertDateToDefaultSqlDate(date)
  }

  function handleClear() {
    const filter = new FilterModel()
    setTreeId('')
    setPlanterId('')
    setDeviceId('')
    setPlanterIdentifier('')
    setStatus('All')
    setDateStart(dateStartDefault)
    setDateEnd(dateEndDefault)
    setApproved()
    setActive()
    props.onSubmit && props.onSubmit(filter)
  }

  function handleSubmit() {
    const filter = new FilterModel()
    filter.treeId = treeId
    filter.planterId = planterId
    filter.deviceId = deviceId
    filter.planterIdentifier = planterIdentifier
    filter.status = status
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined
    filter.approved = approved
    filter.active = active
    props.onSubmit && props.onSubmit(filter)
  }

  function handleCloseClick() {
    props.onClose && props.onClose()
  }

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={props.isOpen}
      variant="persistent"
      anchor="right"
      PaperProps={{
        elevation: props.isOpen ? 6 : 0,
      }}
    >
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">Filters</Typography>
        </Grid>
        {props.onClose &&
          <Grid item>
            <IconButton
              color="primary"
              classes={{
                colorPrimary: classes.close,
              }}
              onClick={handleCloseClick}
            >
              <IconClose />
            </IconButton>
          </Grid>
        }
        </Grid>
      <Button variant="outlined" color="primary" onClick={handleSubmit}>
        Apply Filters
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClear}
        className={classNames(classes.button)}
      >
        Clear Filters
      </Button>
      <GSInputLabel text="Tree Id" />
      <TextField
        placeholder="e.g. 80"
        InputLabelProps={{
          shrink: true,
        }}
        value={treeId}
        onChange={(e) => setTreeId(e.target.value)}
      />
      <GSInputLabel text="Planter Id" />
      <TextField
        placeholder="planter id"
        InputLabelProps={{
          shrink: true,
        }}
        value={planterId}
        onChange={(e) => setPlanterId(e.target.value)}
      />
      <GSInputLabel text="Device Id" />
      <TextField
        placeholder="device id"
        InputLabelProps={{
          shrink: true,
        }}
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
      />
      <GSInputLabel text="Planter Identifier" />
      <TextField
        placeholder="planter identifier"
        InputLabelProps={{
          shrink: true,
        }}
        value={planterIdentifier}
        onChange={(e) => setPlanterIdentifier(e.target.value)}
      />
      {/*
      <GSInputLabel text="Status" />
      <TextField
        select
        placeholder="e.g. 80"
        value={status ? status : 'All'}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setStatus(e.target.value === 'All' ? '' : e.target.value)}
      >
        {['All', 'Planted', 'Hole dug', 'Not a tree', 'Blurry'].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      */}
      <GSInputLabel text="Approved" />
      <TextField
        select
        value={approved === undefined ? 'All' : approved === true ? 'true' : 'false'}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) =>
          setApproved(
            e.target.value === 'All' ? undefined : e.target.value === 'true' ? true : false
          )
        }
      >
        {['All', 'true', 'false'].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <GSInputLabel text="Rejected" />
      <TextField
        select
        value={active === undefined ? 'All' : active === true ? 'false' : 'true'}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) =>
          setActive(e.target.value === 'All' ? undefined : e.target.value === 'true' ? false : true)
        }
      >
        {['All', 'false', 'true'].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <GSInputLabel text="Time created" />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDatePickerLocale()}>
        <Grid container justify="space-between">
          <KeyboardDatePicker
            margin="normal"
            id="start-date-picker"
            label="Start Date"
            value={dateStart}
            onChange={handleDateStartChange}
            format={getDateFormatLocale(true)}
            maxDate={dateEnd}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateInput}
          />
          <KeyboardDatePicker
            margin="normal"
            id="end-date-picker"
            label="End Date"
            value={dateEnd}
            onChange={handleDateEndChange}
            format={getDateFormatLocale(true)}
            minDate={dateStart}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateInput}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Drawer>
  )
}

//export default compose(
//  withStyles(styles, { withTheme: true, name: 'Filter' })
//)(Filter)
export default withStyles(styles)(Filter)
