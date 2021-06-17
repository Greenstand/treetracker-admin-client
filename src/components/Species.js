import React, { useContext, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import { SpeciesContext } from '../context/SpeciesContext';

const styles = () => {
  return {
    root: {
      color: 'red',
      '& div': {
        padding: '0px !important',
      },
    },
  };
};

function Species(props) {
  // Verify also uses speciesInput so keep it on context
  const speciesContext = useContext(SpeciesContext);
  /* load species list when mount*/
  useEffect(() => {
    speciesContext.loadSpeciesList();
  }, [speciesContext.speciesList]);

  return (
    <Autocomplete
      options={speciesContext.speciesList}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      onChange={(_event, value) => {
        speciesContext.onChange((value && value.name) || '');
      }}
      onInputChange={(_event, value) => {
        speciesContext.onChange(value || '');
      }}
      className={props.classes.root}
      freeSolo={true}
      inputValue={speciesContext.speciesInput}
      renderInput={(params) => (
        <TextField {...params} placeholder="e.g. Mango" variant="outlined" />
      )}
    />
  );
}

export default withStyles(styles)(Species);
