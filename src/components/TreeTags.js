import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import ChipInput from 'material-ui-chip-input'
import Autosuggest from 'react-autosuggest'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';

const useStyles = makeStyles(theme => ({
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
      padding: theme.spacing(2,0,0,2),
    },
    '.MuiChip-root': {
      fontSize: '0.7rem',
    },
  },
}))

function renderSuggestion (suggestion, { query, isHighlighted }) {

  return (
    <MenuItem
      selected={isHighlighted}
      component='div'
      onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {suggestion.tagName}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue (suggestion) {
  return suggestion.tagName
}

// This is needed to pass the same function to debounce() each time
const debounceCallback = ({value, callback}) => {
  return callback && callback(value)
}

const TreeTags = (props) => {

  const classes = useStyles(props);
  const [ textFieldInput, setTextFieldInput ] = React.useState('');
  const [ error, setError ] = React.useState(false)
  const debouncedInputHandler = useCallback(_.debounce(debounceCallback, 250), [])
  const TAG_PATTERN = '^\\w*$'

  function renderInput (inputProps) {
    const { value, onChange, chips, pattern, ...other } = inputProps
  
    return (
      <ChipInput
        clearInputValueOnChange
        onUpdateInput={onChange}
        value={chips}
        {...other}
        variant='outlined'
        fullWidth
        classes={{inputRoot: classes.chipInput}}
        allowDuplicates={false}
        blurBehavior='add'
        InputProps={{
          inputProps: {pattern},
          error,
        }}
        helperText={error && 'Tags may contain only letters, numbers and underscores'}
        FormHelperTextProps={{error}}
      />
    )
  }
  
  const isValidTagString = (value) => RegExp(TAG_PATTERN).test(value)

  let handleSuggestionsFetchRequested = ({ value }) => {
    debouncedInputHandler({value,
      callback: (val) => {
        if (isValidTagString(val)) {
          return props.tagDispatch.getTags(val)
        }
        return null
      }
    })
  }

  let handleSuggestionsClearRequested = () => {
  }

  let handletextFieldInputChange = (event, { newValue }) => {
    setTextFieldInput(newValue)
    setError(!isValidTagString(newValue))
  }

  let handleBeforeAddChip = (chip) => {
    return !error;
  }

  let handleAddChip = (chip) => {
    props.tagDispatch.setTagInput(props.tagState.tagInput.concat([chip]))
  }

  let handleDeleteChip = (chip, index) => {
    const temp = props.tagState.tagInput;
    temp.splice(index, 1)
    props.tagDispatch.setTagInput(temp)
  }

  return (
    <Autosuggest
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      renderInputComponent={renderInput}
      suggestions={
        props.tagState.tagList.filter(t => {
          const tagName = t.tagName.toLowerCase()
          return (textFieldInput.length === 0 || tagName.startsWith(textFieldInput.toLowerCase()))
            && !props.tagState.tagInput.find(i => i.toLowerCase() === tagName)
        })
      }
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(e, { suggestionValue }) => { handleAddChip(suggestionValue); e.preventDefault() }}
      focusInputOnSuggestionClick
      inputProps={{
        classes,
        chips: props.tagState.tagInput,
        onChange: handletextFieldInputChange,
        value: textFieldInput,
        onBeforeAdd: (chip) => handleBeforeAddChip(chip),
        onAdd: (chip) => handleAddChip(chip),
        onDelete: (chip, index) => handleDeleteChip(chip, index),
        pattern: TAG_PATTERN,
        placeholder: props.placeholder,
      }}
    />
  )
}


export default connect(
  state => ({
    tagState: state.tags
  }),
  dispatch => ({
    tagDispatch: dispatch.tags
  }),
)(TreeTags)
