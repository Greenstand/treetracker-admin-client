import React, { useState, useContext } from 'react';
import ChipInput from 'material-ui-chip-input';
import Autosuggest from 'react-autosuggest';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
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
      <div>{suggestion.name}</div>
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
  return suggestion.name;
}

const CaptureTags = (props) => {
  // console.log('render: capture tags');
  const classes = useStyles(props);
  const tagsContext = useContext(TagsContext);
  const [textFieldInput, setTextFieldInput] = useState('');
  const [error, setError] = useState(false);
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

  const handletextFieldInputChange = (event, { newValue }) => {
    setTextFieldInput(newValue);
    setError(!isValidTagString(newValue));
  };

  const handleBeforeAddChip = () => {
    return !error;
  };

  const handleAddChip = (chip) => {
    tagsContext.setTagInput(tagsContext.tagInput.concat([chip]));
  };

  const handleDeleteChip = (_chip) => {
    const temp = tagsContext.tagInput;
    const result = temp.filter((value) => value !== _chip);
    tagsContext.setTagInput(result);
  };

  const mainSuggestions = [
    { name: 'simple_leaf' },
    { name: 'mangrove' },
    { name: 'acacia_like' },
    { name: 'fruit' },
    { name: 'timber' },
    { name: 'complex_leaf' },
    { name: 'conifer' },
    { name: 'palm' },
  ];

  const secondarySuggestions = tagsContext.tagList.filter((t) => {
    const tagName = t.name.toLowerCase();
    return (
      (textFieldInput.length === 0 ||
        tagName.startsWith(textFieldInput.toLowerCase())) &&
      !tagsContext.tagInput.find((i) => i.toLowerCase() === tagName)
    );
  });

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
      suggestions={
        textFieldInput === '' ? mainSuggestions : secondarySuggestions
      }
      onSuggestionsFetchRequested={() => {}}
      onSuggestionsClearRequested={() => {}}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      shouldRenderSuggestions={() => {
        return true;
      }}
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
        onDelete: (chip) => handleDeleteChip(chip),
        pattern: TAG_PATTERN,
        placeholder: props.placeholder,
      }}
    />
  );
};

export default CaptureTags;
