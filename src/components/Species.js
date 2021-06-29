import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import SpeciesContext from '../context/SpeciesContext';

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
  const context = useContext(SpeciesContext);
  /* load species list when mount*/
  React.useEffect(() => {
    // don't call unless the list is empty
    if (context.speciesList.length <= 0) {
      context.loadSpeciesList();
    }
  }, []);

  return (
    <Autocomplete
      options={context.speciesList}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      onChange={(_event, value) => {
        context.onChange((value && value.name) || '');
      }}
      onInputChange={(_event, value) => {
        context.onChange(value || '');
      }}
      className={props.classes.root}
      freeSolo={true}
      inputValue={context.speciesInput}
      renderInput={(params) => (
        <TextField {...params} placeholder="e.g. Mango" variant="outlined" />
      )}
    />
  );
}

export default withStyles(styles)(Species);
