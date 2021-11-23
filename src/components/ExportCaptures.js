import React, { useState, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { CapturesContext } from '../context/CapturesContext';
import { CSVLink } from "react-csv";
import { formatCell } from './Captures/CaptureTable';
import { LinearProgress } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: theme.spacing(0, 4),
  },
  textInput: {
    margin: theme.spacing(2, 1),
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const ExportCaptures = (props) => {
  const { isOpen, handleClose, columns, filter, speciesState } = props;
  const classes = useStyle();
  let nameColumns = {};
  columns.forEach(({ attr, renderer }) => {
    nameColumns[attr] = {status: true, renderer: renderer};
  });
  // checkboxes to choose download columns
  const [checkedColumns, setCheckColumns] = useState(nameColumns);
  const capturesContext = useContext(CapturesContext);
  const [downloadData, setDownloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const csvLink = useRef();

  function handleChange(attr) {
    const newStatus = !checkedColumns[attr].status;
    setCheckColumns({ ...checkedColumns, [attr]: { ...checkedColumns[attr], status: newStatus }});
  }

  function processDownloadData(captures, selectedColumns) {
    return captures.map(capture => {
      let formatCapture = {};
      Object.keys(selectedColumns).forEach(attr => {
        if (attr === 'id' || attr === 'planterId') {
          formatCapture[attr] = capture[attr];
        } else {
          const renderer = selectedColumns[attr].renderer;
          formatCapture[attr] = formatCell(capture, speciesState, attr, renderer);
        }
      })
      return formatCapture;
    })
  }

  async function downloadCaptures() {
    setLoading(true);
    const filterColumns = Object.entries(checkedColumns).filter((val) => val[1].status === true);
    const selectedColumns = Object.fromEntries(filterColumns);
    await capturesContext.getAllCaptures({ filter }).then((response) => {
      setDownloadData(processDownloadData(response.data, selectedColumns));
      setLoading(false);
    });
    csvLink.current.link.click();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Export Captures</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            {columns.map(({ attr, label }) => (
              <FormControlLabel
                key={attr}
                control={
                  <Checkbox
                    checked={checkedColumns[attr].status}
                    onChange={() => handleChange(attr)}
                    name={attr}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="primary" onClick={downloadCaptures}>Download</Button>
        <CSVLink
          data={downloadData}
          filename={"captures.csv"}
          ref={csvLink}
        />
      </DialogActions>
      {
        loading && <LinearProgress color="primary" />
      }
    </Dialog>
  );
};

export default ExportCaptures;