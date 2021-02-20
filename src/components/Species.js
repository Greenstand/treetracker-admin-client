import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {connect} from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = theme => {
  return {
    root: {
      color: 'red',
      '& div': {
        padding: '0px !important',
      },
    },
  }
}

function Species(props){
  /* load species list when mount*/
  React.useEffect(() => {
    props.speciesDispatch.loadSpeciesList()
  }, [props.speciesDispatch])

  return(
  <Autocomplete
    options={props.speciesState.speciesList}
    getOptionLabel={(option) => option.name}
    style={{ width: 300 }}
    onChange={(a,b,c) => {
      props.speciesDispatch.onChange((b && b.name) || '')
    }}
    onInputChange={(a,b,c) => {
      props.speciesDispatch.onChange(b || '')
    }}
    className={props.classes.root}
    freeSolo={true}
    renderInput={(params) => 
      <TextField 
        {...params} 
        placeholder='e.g. Mango'
        variant="outlined" 
      />}
    />
  )
}

export default withStyles(styles)(connect(
  //state
  state => ({
    speciesState: state.species
  }),
  //dispatch
  dispatch => ({
    speciesDispatch: dispatch.species
  })
)(Species));
