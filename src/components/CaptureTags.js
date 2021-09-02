import React, { useState, useCallback, useContext } from 'react';
import ChipInput from 'material-ui-chip-input';
import Autosuggest from 'react-autosuggest';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import { TagsContext } from '../context/TagsContext';

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    left: 0,
    right: 0,
    zIndex: 1,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  chipInput: {
    '&.MuiOutlinedInput-root': {
      padding: theme.spacing(2, 0, 0, 2),
    },
    '.MuiChip-root': {
      fontSize: '0.7rem',
    },
  },
}));

function renderSuggestion(suggestion, { isHighlighted }) {
  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>{suggestion.tagName}</div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} data-testid="tag-suggestion" square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.tagName;
}

// This is needed to pass the same function to debounce() each time
const debounceCallback = ({ value, callback }) => {
  return callback && callback(value);
};

const CaptureTags = (props) => {
  // console.log('render: capture tags');
  const classes = useStyles(props);
  const tagsContext = useContext(TagsContext);
  const [textFieldInput, setTextFieldInput] = useState('');
  const [error, setError] = useState(false);
  const debouncedInputHandler = useCallback(
    _.debounce(debounceCallback, 250),
    [],
  );
  const TAG_PATTERN = '^\\w*$';

  function renderInput(inputProps) {
    const { onChange, chips, pattern, ...other } = inputProps;

    return (
      <ChipInput
        {...other}
        data-testid="tag-chip-input"
        clearInputValueOnChange
        onUpdateInput={onChange}
        value={chips}
        variant="outlined"
        fullWidth
        classes={{ inputRoot: classes.chipInput }}
        allowDuplicates={false}
        blurBehavior="add"
        InputProps={{
          inputProps: { pattern },
          error,
        }}
        helperText={
          error && 'Tags may contain only letters, numbers and underscores'
        }
        FormHelperTextProps={{ error }}
      />
    );
  }

  const isValidTagString = (value) => RegExp(TAG_PATTERN).test(value);

  let handleSuggestionsFetchRequested = ({ value }) => {
    debouncedInputHandler({
      value,
      callback: (val) => {
        if (isValidTagString(val)) {
          return tagsContext.getTags(val);
        }
        return null;
      },
    });
  };

  let handleSuggestionsClearRequested = () => {};

  let handletextFieldInputChange = (event, { newValue }) => {
    setTextFieldInput(newValue);
    setError(!isValidTagString(newValue));
  };

  let handleBeforeAddChip = () => {
    return !error;
  };

  let handleAddChip = (chip) => {
    tagsContext.setTagInput(tagsContext.tagInput.concat([chip]));
  };

  let handleDeleteChip = (_chip, index) => {
    const temp = tagsContext.tagInput;
    temp.splice(index, 1);
    tagsContext.setTagInput(temp);
  };

  return (
    <Autosuggest
      data-testid="tag-autosuggest"
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
      }}
      renderInputComponent={renderInput}
      suggestions={tagsContext.tagList.filter((t) => {
        const tagName = t.tagName.toLowerCase();
        return (
          (textFieldInput.length === 0 ||
            tagName.startsWith(textFieldInput.toLowerCase())) &&
          !tagsContext.tagInput.find((i) => i.toLowerCase() === tagName)
        );
      })}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(e, { suggestionValue }) => {
        handleAddChip(suggestionValue);
        e.preventDefault();
      }}
      focusInputOnSuggestionClick
      inputProps={{
        classes,
        chips: tagsContext.tagInput,
        onChange: handletextFieldInputChange,
        value: textFieldInput,
        onBeforeAdd: (chip) => handleBeforeAddChip(chip),
        onAdd: (chip) => handleAddChip(chip),
        onDelete: (chip, index) => handleDeleteChip(chip, index),
        pattern: TAG_PATTERN,
        placeholder: props.placeholder,
      }}
    />
  );
};

export default CaptureTags;
