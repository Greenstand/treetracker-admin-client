import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import { SpeciesContext } from '../context/SpeciesContext';
import { CircularProgress } from '@material-ui/core';

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

  return (
    <>
      {speciesContext.isLoading ? (
        <CircularProgress size={30} />
      ) : (
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
          inputValue={speciesContext.speciesInput}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="e.g. Mango"
              variant="outlined"
            />
          )}
        />
      )}
    </>
  );
}

export default withStyles(styles)(Species);
