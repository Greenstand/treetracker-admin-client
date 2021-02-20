import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FilterModel from '../models/FilterPlanter';
import {connect} from 'react-redux';


export const FILTER_WIDTH = 330;

const styles = theme => {
  return {
    root: {},
    drawer: {
      flexShrink: 0
    },
    drawerPaper: {
      width: FILTER_WIDTH,
      padding: theme.spacing(3, 2, 2, 2)
      /*
       * boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
       * */
    },
    close: {
      color: theme.palette.grey[500]
    },
    dateInput: {
      width: 158,
      fontSize: 14
    },
    button: {
      marginTop: 5
    },
    inputContaner: {
      padding: 5,
    },
    input: {
      margin: theme.spacing(2),
    },
    filterElement: {
      marginLeft: 4,
    },
    textField: {
      marginTop: 15,
      width: 142,
      paddingBottom:2,
    },
    textFieldSelect: {
      marginTop: 17,
      width: 142,
    },
    apply: {
      marginTop: 15,
      marginLeft: 4,
    },
  };
};

function FilterTopPlanter(props) {
  const { classes } = props;
  const [id, setId] = useState("");
  const [personId, setPersonId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  function handleSubmit() {
    const filter = new FilterModel({
      personId,
      id,
      firstName,
      lastName,
      organizationId,
    });
    props.onSubmit && props.onSubmit(filter);
  }

  return (
    <React.Fragment>
      {
        <Grid container>
          <Grid item className={classes.inputContainer}>
            <TextField
              className={`${classes.textField} ${classes.filterElement}`}
              label='Planter ID'
              placeholder='Planter ID'
              value={id}
              onChange={e => setId(e.target.value)}
            />
            <TextField
              className={`${classes.textField} ${classes.filterElement}`}
              label='Person ID'
              placeholder='Person ID'
              value={personId}
              onChange={e => setPersonId(e.target.value)}
            />
            <TextField
              className={`${classes.textField} ${classes.filterElement}`}
              label='Organization ID'
              placeholder='Organization ID'
              value={organizationId}
              onChange={e => setOrganizationId(e.target.value)}
            />
            <TextField
              className={`${classes.textField} ${classes.filterElement}`}
              label='First Name'
              placeholder='First Name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <TextField
              className={`${classes.textField} ${classes.filterElement}`}
              label='Last Name'
              placeholder='Last Name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <Button 
              className={classes.apply}
              variant='outlined' color='primary' onClick={handleSubmit}>
              Apply 
            </Button>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )

}

//export default compose(
//  withStyles(styles, { withTheme: true, name: 'Filter' })
//)(Filter)
export default withStyles(styles)(connect(
  //state
  state => ({
    speciesState: state.species
  }),
 )(FilterTopPlanter));
